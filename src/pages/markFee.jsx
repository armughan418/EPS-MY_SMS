import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const MarkFee = () => {
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedClass, setSelectedClass] = useState("All");
    const [selectedRows, setSelectedRows] = useState({});
    const [remainingFees, setRemainingFees] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fees/api/students`);
            const feesInit = {};
            res.data.students.forEach((s) => {
                feesInit[s._id] = s.remainingFee !== undefined ? s.remainingFee : 0;
            });
            setRemainingFees(feesInit);
            setStudents(res.data.students);
        } catch (error) {
            console.error("Error fetching students:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => setFilter(e.target.value);
    const handleClassFilter = (cls) => setSelectedClass(cls);
    const toggleRow = (id) => setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleRemainingFeeChange = (id, value) => {
        const newValue = Number(value) || 0;
        setRemainingFees((prev) => ({ ...prev, [id]: newValue >= 0 ? newValue : 0 }));
    };

    const filteredStudents = students.filter((student) => {
        const matchesQuery =
            student.firstName.toLowerCase().includes(filter.toLowerCase()) ||
            student.lastName.toLowerCase().includes(filter.toLowerCase());
        const matchesClass = selectedClass === "All" || student.classLevel === selectedClass;
        return matchesQuery && matchesClass;
    });

    const handleSave = async () => {
        const selectedData = filteredStudents
            .filter((row) => selectedRows[row._id])
            .map((row) => {
                const remaining = Number(remainingFees[row._id] || 0);
                const paidAmount = remaining > row.fee ? 0 : Math.max(0, row.fee - remaining);
                return { studentId: row._id, paidAmount, remainingFee: remaining };
            });

        if (!selectedData.length) {
            toast.error("No students selected");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/fees/api/students/markFeePaid`, selectedData, { headers: { "Content-Type": "application/json" } });
            toast.success("Fee details saved successfully!");
            fetchStudents();
            setSelectedRows({});
        } catch (error) {
            console.error("Error saving fee details:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to save fee details");
        } finally {
            setLoading(false);
        }
    };

    const classLevels = ["All", "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    const checkedCount = Object.values(selectedRows).filter(Boolean).length;

    return (
        <div className="p-4">
            <div className="relative bg-white shadow-lg flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Mark Student Fee</h1>
                <span className="font-bold text-blue-900">Checked Students: {checkedCount}</span>
            </div>
            {loading && <div className="text-center mt-4">Loading...</div>}
            <div className="flex justify-center items-center mt-5">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-4 py-2 w-full max-w-md">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input
                        type="search"
                        placeholder="Search Student by name..."
                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        value={filter}
                        onChange={handleSearch}
                        disabled={loading}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center my-3">
                {classLevels.map((level) => (
                    <button
                        key={level}
                        className={`px-6 py-2 rounded-md shadow-md font-semibold text-white bg-blue-900 hover:bg-blue-800 ${selectedClass === level ? "bg-blue-800" : ""
                            }`}
                        onClick={() => handleClassFilter(level)}
                        disabled={loading}
                    >
                        {level}
                    </button>
                ))}
            </div>
            <div className="mt-6">
                {filteredStudents.length > 0 ? (
                    <table className="w-full border-collapse bg-white shadow-md rounded-md">
                        <thead>
                            <tr className="bg-blue-900 text-white">
                                <th className="p-3 border text-center">Sr #</th>
                                <th className="p-3 border text-center">Select</th>
                                <th className="p-3 border text-center">First Name</th>
                                <th className="p-3 border text-center">Last Name</th>
                                <th className="p-3 border text-center">Class</th>
                                <th className="p-3 border text-center">Total Fee</th>
                                <th className="p-3 border text-center">Remaining Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, idx) => (
                                <tr key={student._id} className="border-b hover:bg-gray-100">
                                    <td className="p-3 border text-center">{idx + 1}</td>
                                    <td className="p-3 border text-center">
                                        <input type="checkbox" checked={!!selectedRows[student._id]} onChange={() => toggleRow(student._id)} disabled={loading} />
                                    </td>
                                    <td className="p-3 border text-center">{student.firstName}</td>
                                    <td className="p-3 border text-center">{student.lastName}</td>
                                    <td className="p-3 border text-center">{student.classLevel}</td>
                                    <td className="p-3 border text-center">{student.fee}</td>
                                    <td className="p-3 border text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            value={remainingFees[student._id] || 0}
                                            onChange={(e) => handleRemainingFeeChange(student._id, e.target.value)}
                                            className="w-20 p-1 border rounded-md text-center"
                                            disabled={loading}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center mt-4">No students found</p>
                )}
            </div>
            <button
                onClick={handleSave}
                disabled={loading || checkedCount === 0}
                className={`mt-6 px-6 py-3 font-bold rounded-md block mx-auto ${loading || checkedCount === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-800"
                    }`}
            >
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
};

export default MarkFee;
