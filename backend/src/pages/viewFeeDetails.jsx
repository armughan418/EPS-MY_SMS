import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React from "react";


const ViewFeeDetails = () => {
    const [activeTab, setActiveTab] = useState("Fee Paid");
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    const tabs = ["Fee Paid", "Fee Not Paid"];

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fees/api/students`);
            setStudents(res.data.students);
            console.log("Fetched students for fee details:", res.data.students);
        } catch (error) {
            console.error("Error fetching students:", error.response?.data || error);
            toast.error("Failed to load student data");
        } finally {
            setLoading(false);
        }
    };

    const hasPaidFee = (student) => {
        return Array.isArray(student.feeHistory) && student.feeHistory.some((fee) => fee.status === "paid");
    };

    const filteredStudents = students.filter((student) => {
        if (activeTab === "Fee Paid") {
            return student.remainingFee === 0 || hasPaidFee(student);
        } else {
            return student.remainingFee > 0 && !hasPaidFee(student);
        }
    });

    const searchedStudents = filteredStudents.filter((student) =>
        `${student.firstName} ${student.lastName} ${student.classLevel} ${student.rollNo}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const toggleRow = (studentId) => {
        setExpandedRows((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    return (
        <>
            <div className="relative bg-white shadow-lg shadow-gray-300 flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Fee Details</h1>
            </div>
            <div className="w-full p-4">
                <div className="flex border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-lg font-medium ${activeTab === tab ? "border-b-4 border-blue-900 text-blue-900" : "text-gray-600"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="my-4 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search student by name, class, or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-96 p-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
                <div className="overflow-x-auto mt-4">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading students...</p>
                    ) : (
                        <table className="min-w-full border-collapse border border-blue-900">
                            <thead>
                                <tr className="bg-blue-900 text-white">
                                    <th className="border p-2">Sr #</th>
                                    <th className="border p-2">Class Level</th>
                                    <th className="border p-2">Roll Number</th>
                                    <th className="border p-2">First Name</th>
                                    <th className="border p-2">Last Name</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Total Fee</th>
                                    <th className="border p-2">Remaining Fee</th>
                                    <th className="border p-2">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedStudents.length > 0 ? (
                                    searchedStudents.map((student, index) => (
                                        <React.Fragment key={student._id}>
                                            <tr
                                                className="text-center hover:bg-gray-100 cursor-pointer"
                                                onClick={() => toggleRow(student._id)}
                                            >
                                                <td className="border p-2">{index + 1}</td>
                                                <td className="border p-2">{student.classLevel}</td>
                                                <td className="border p-2">{student.rollNo}</td>
                                                <td className="border p-2">{student.firstName}</td>
                                                <td className="border p-2">{student.lastName}</td>
                                                <td className={`border p-2 font-bold ${student.remainingFee === 0 ? "text-green-600" : "text-red-600"}`}>
                                                    {student.remainingFee === 0 ? "Fully Paid" : hasPaidFee(student) ? "Partially Paid" : "Pending"}
                                                </td>
                                                <td className="border p-2">PKR {student.fee}</td>
                                                <td className="border p-2">PKR {student.remainingFee}</td>
                                                <td className="border p-2">
                                                    {expandedRows[student._id] ? <FaChevronUp /> : <FaChevronDown />}
                                                </td>
                                            </tr>
                                            {expandedRows[student._id] && (
                                                <tr>
                                                    <td colSpan="9" className="border p-2">
                                                        <div className="bg-gray-100 p-2 rounded">
                                                            <h4 className="font-bold">Fee History</h4>
                                                            {student.feeHistory && student.feeHistory.length > 0 ? (
                                                                <table className="w-full border-collapse">
                                                                    <thead>
                                                                        <tr className="bg-gray-200">
                                                                            <th className="p-2">Amount</th>
                                                                            <th className="p-2">Status</th>
                                                                            <th className="p-2">Date</th>
                                                                            <th className="p-2">Description</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {student.feeHistory.map((entry, idx) => (
                                                                            <tr key={idx} className="text-center">
                                                                                <td className="p-2">PKR {entry.amount}</td>
                                                                                <td className={`p-2 ${entry.status === "paid" ? "text-green-600" : "text-red-600"}`}>{entry.status}</td>
                                                                                <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                                                                                <td className="p-2">{entry.description}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p>No fee history available.</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="border p-4 text-center text-gray-500">No students found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewFeeDetails;
