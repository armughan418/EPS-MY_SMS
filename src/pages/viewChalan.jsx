import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import Barcode from "react-barcode";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function FeeChalan() {
    const location = useLocation();
    const student = location.state?.student;
    const contentRef = useRef(null);

    if (!student) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-bold text-red-600">
                No student data available. Please generate a challan first.
            </div>
        );
    }

    const {
        firstName = "N/A",
        lastName = "N/A",
        rollNo = "N/A",
        fatherName = "N/A",
        classLevel = "N/A",
        fee = 0,
        remainingFee = 0,
    } = student;

    const totalFee = Number(fee);
    const prevDues = remainingFee > totalFee ? remainingFee - totalFee : 0;
    const finalAmount = remainingFee;

    const generateChalanId = () => `${rollNo}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const chalanId = generateChalanId();

    const formatDate = (date) =>
        new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);

    const today = new Date();
    const printDate = formatDate(today);
    const dueDate = formatDate(new Date(today.setDate(today.getDate() + 4)));

    const handleDownloadPDF = () => {
        html2canvas(contentRef.current, { scale: 2, useCORS: true })
            .then((canvas) => {
                const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
                const imgData = canvas.toDataURL("image/png");
                pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    0,
                    pdf.internal.pageSize.getWidth(),
                    (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width
                );
                pdf.save(`Challan_${rollNo}_${today.toISOString().split("T")[0]}.pdf`);
            })
            .catch((error) => {
                console.error("Error generating PDF:", error);
            });
    };

    return (
        <>
            <div className="relative bg-white shadow-lg flex justify-between items-center py-3 px-6 md:px-20 rounded-md">
                <h1 className="font-bold text-blue-900 text-lg md:text-xl">Challan Form</h1>
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-md shadow-lg hover:bg-blue-800 transition"
                >
                    <FaDownload size={20} />
                    Download PDF
                </button>
            </div>
            <div ref={contentRef} className="bg-gray-300 p-4">
                <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center mt-5 text-sm md:text-lg">
                    <ChallanSection
                        title="Student Copy"
                        schoolName="Excellent Public School"
                        student={{ firstName, lastName, rollNo, fatherName, classLevel }}
                        fee={{ totalFee, prevDues, finalAmount }}
                        chalanId={chalanId}
                        dueDate={dueDate}
                        printDate={printDate}
                    />
                    <ChallanSection
                        title="School Copy"
                        schoolName="Excellent Public School"
                        student={{ firstName, lastName, rollNo, fatherName, classLevel }}
                        fee={{ totalFee, prevDues, finalAmount }}
                        chalanId={chalanId}
                        dueDate={dueDate}
                        printDate={printDate}
                    />
                </div>
            </div>
        </>
    );
}

const ChallanSection = ({ title, schoolName, student, fee, chalanId, dueDate, printDate }) => (
    <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
            <thead>
                <tr>
                    <th className="border px-4 py-2 font-bold text-lg" colSpan="2">
                        {schoolName} - {title}
                    </th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(student).map(([key, value]) => (
                    <tr key={key}>
                        <td className="border px-4 py-2 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</td>
                        <td className="border px-4 py-2">{value}</td>
                    </tr>
                ))}
                <tr>
                    <td className="border px-4 py-2">Total Fee</td>
                    <td className="border px-4 py-2">Rs. {fee.totalFee}</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2">Previous Dues</td>
                    <td className="border px-4 py-2">Rs. {fee.prevDues}</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2 font-bold">Final Amount</td>
                    <td className="border px-4 py-2 font-bold">Rs. {fee.finalAmount}</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2">Challan ID</td>
                    <td className="border px-4 py-2">{chalanId}</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2">Due Date</td>
                    <td className="border px-4 py-2">{dueDate}</td>
                </tr>
                <tr>
                    <td colSpan="2" className="border px-4 py-2 text-center">
                        <Barcode value={chalanId.toString()} />
                    </td>
                </tr>
                <tr>
                    <td colSpan="2" className="border px-4 py-2 text-right text-gray-500">
                        Printed on: {printDate}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default FeeChalan;
