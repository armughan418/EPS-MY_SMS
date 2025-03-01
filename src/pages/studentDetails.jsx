import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function ViewStudentDetails() {
    const [students, setStudents] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/students/api/students`);
            setStudents(res.data.students);
        } catch (error) {
            console.error("Error fetching students:", error.response?.data || error);
            toast.error("Error fetching students");
        } finally {
            setLoading(false);
        }
    };

    // Debounced search input handling
    const handleSearch = useCallback((e) => {
        setQuery(e.target.value);
    }, []);

    const handleClassFilter = (cls) => setSelectedClass(cls);

    // Memoized filtering logic
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesQuery =
                student.firstName.toLowerCase().includes(query.toLowerCase()) ||
                student.lastName.toLowerCase().includes(query.toLowerCase());
            const matchesClass = selectedClass === "All" || student.classLevel === selectedClass;
            return matchesQuery && matchesClass;
        });
    }, [students, query, selectedClass]);

    return (
        <>
            <div className="relative bg-white shadow-lg flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">View Student Details</h1>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-center flex-col gap-3 mb-4">
                    {/* Search Input */}
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-1/3">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="search"
                            placeholder="Search Student by name..."
                            className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Class Filter Buttons */}
                    <div className="flex space-x-2 overflow-auto">
                        {["All", "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((cls) => (
                            <button
                                key={cls}
                                className={`px-4 py-2 rounded-md ${selectedClass === cls ? "bg-blue-800 text-white" : "bg-blue-900 text-white hover:bg-blue-800"
                                    }`}
                                onClick={() => handleClassFilter(cls)}
                            >
                                {cls}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="p-3 border text-center">Sr #</th>
                                <th className="p-3 border text-center">Class Level</th>
                                <th className="p-3 border text-center">Roll Number</th>
                                <th className="p-3 border text-center">First Name</th>
                                <th className="p-3 border text-center">Last Name</th>
                                <th className="p-3 border text-center">Father Name</th>
                                <th className="p-3 border text-center">DOB</th>
                                <th className="p-3 border text-center">B Form Number</th>
                                <th className="p-3 border text-center">Father CNIC</th>
                                <th className="p-3 border text-center">Phone No</th>
                                <th className="p-3 border text-center">Nationality</th>
                                <th className="p-3 border text-center">Religion</th>
                                <th className="p-3 border text-center">Total Fees</th>
                                <th className="p-3 border text-center">Date of Admission</th>
                                <th className="p-3 border text-center">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="15" className="py-2 px-4 text-center">Loading students...</td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-gray-100">
                                        <td className="p-3 border text-center">{index + 1}</td>
                                        <td className="p-3 border text-center capitalize">{student.classLevel}</td>
                                        <td className="p-3 border text-center">{student.rollNo}</td>
                                        <td className="p-3 border text-center capitalize">{student.firstName}</td>
                                        <td className="p-3 border text-center capitalize">{student.lastName}</td>
                                        <td className="p-3 border text-center capitalize">{student.fatherName}</td>
                                        <td className="p-3 border text-center">{new Date(student.dob).toLocaleDateString()}</td>
                                        <td className="p-3 border text-center">{student.bForm}</td>
                                        <td className="p-3 border text-center">{student.fatherCNIC}</td>
                                        <td className="p-3 border text-center">{student.contact}</td>
                                        <td className="p-3 border text-center">{student.nationality}</td>
                                        <td className="p-3 border text-center">{student.religion}</td>
                                        <td className="p-3 border text-center">{student.fee}</td>
                                        <td className="p-3 border text-center">{new Date(student.dateOfAdmission).toLocaleDateString()}</td>
                                        <td className="p-3 border text-center">{student.address}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="15" className="py-2 px-4 text-center">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ViewStudentDetails;
