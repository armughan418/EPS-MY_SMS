import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function GenerateChalan() {
    const [query, setQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("All");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fees/api/students`);
            setStudents(res.data.students);
            console.log("Fetched students for chalan:", res.data.students);
        } catch (error) {
            console.error("Error fetching students:", error.response?.data || error);
            toast.error("Failed to load student data");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => setQuery(e.target.value);

    const handleClassFilter = (className) => setSelectedClass(className);

    const handleGenerateChalan = (student) => navigate("/fee-chalan", { state: { student } });

    const filteredStudents = students.filter((student) => {
        const matchesClass = selectedClass === "All" || student.classLevel === selectedClass;
        const matchesSearch =
            (student.firstName && student.firstName.toLowerCase().includes(query.toLowerCase())) ||
            (student.lastName && student.lastName.toLowerCase().includes(query.toLowerCase())) ||
            (student.rollNo && String(student.rollNo).includes(query));
        return matchesClass && matchesSearch;
    });

    const classLevels = ["All", "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

    return (
        <>
            <div className="relative bg-white shadow-lg shadow-gray-300 flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Generate Chalan</h1>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-center flex-col gap-3 mb-4">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-1/3">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="search"
                            placeholder="Search by name or roll number..."
                            className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex space-x-2 overflow-auto">
                        {classLevels.map((cls) => (
                            <button
                                key={cls}
                                className={`px-4 py-2 rounded-md ${selectedClass === cls ? "bg-blue-800 text-white" : "bg-blue-900 text-white hover:bg-blue-800"}`}
                                onClick={() => handleClassFilter(cls)}
                            >
                                {cls}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500">Loading students...</p>
                ) : (
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="p-3 border text-center">Sr #</th>
                                <th className="p-3 border text-center">Class Level</th>
                                <th className="p-3 border text-center">Roll Number</th>
                                <th className="p-3 border text-center">First Name</th>
                                <th className="p-3 border text-center">Last Name</th>
                                <th className="p-3 border text-center">Total Fee</th>
                                <th className="p-3 border text-center">Remaining Fee</th>
                                <th className="p-3 border text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-gray-100">
                                        <td className="p-3 border text-center">{index + 1}</td>
                                        <td className="p-3 border text-center">{student.classLevel}</td>
                                        <td className="p-3 border text-center">{student.rollNo}</td>
                                        <td className="p-3 border text-center">{student.firstName}</td>
                                        <td className="p-3 border text-center">{student.lastName}</td>
                                        <td className="p-3 border text-center">PKR {student.fee}</td>
                                        <td className="p-3 border text-center">PKR {student.remainingFee !== undefined ? student.remainingFee : student.fee}</td>
                                        <td className="p-3 border text-center">
                                            <button className="px-4 py-2 rounded-md text-white bg-blue-900 hover:bg-blue-800" onClick={() => handleGenerateChalan(student)}>
                                                Generate Chalan
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-2 px-4 text-center">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default GenerateChalan;
