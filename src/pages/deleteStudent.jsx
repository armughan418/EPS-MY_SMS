import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import AlertDialog from "../components/alert-dialog"; // Ensure this exists
import UpdateStudentInfoDialog from "../components/update"; // Ensure this exists

function ManageStudent() {
    const [students, setStudents] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("All");
    const [showAlert, setShowAlert] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/students/api/students`);
            setStudents(res.data.students);
        } catch (error) {
            console.error("Error fetching students:", error.response?.data || error);
            toast.error("Error fetching students");
        }
    };

    const handleSearch = (e) => setQuery(e.target.value);
    const handleClassFilter = (cls) => setSelectedClass(cls);

    const openDeleteAlert = (id) => {
        setStudentToDelete(id);
        setShowAlert(true);
    };

    const handleAlertConfirm = async () => {
        if (!studentToDelete) return;
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/students/api/students/${studentToDelete}`);
            toast.success("Student deleted successfully.");
            setStudents(students.filter((student) => student._id !== studentToDelete));
        } catch (error) {
            console.error("Error deleting student:", error.response?.data || error);
            toast.error("Failed to delete student.");
        } finally {
            setShowAlert(false);
            setStudentToDelete(null);
        }
    };

    const handleEditDialog = (student) => {
        setSelectedStudent(student);
        setShowEditDialog(true);
    };

    const handleEditSave = async (updatedStudent) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/students/api/students/${updatedStudent._id}`,
                updatedStudent
            );
            setStudents(students.map((s) => (s._id === updatedStudent._id ? response.data.student : s)));
            toast.success("Student updated successfully");
            setShowEditDialog(false);
        } catch (error) {
            console.error("Error updating student:", error.response?.data || error);
            toast.error("Failed to update student");
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesQuery =
            student.firstName.toLowerCase().includes(query.toLowerCase()) ||
            student.lastName.toLowerCase().includes(query.toLowerCase());
        const matchesClass = selectedClass === "All" || student.classLevel === selectedClass;
        return matchesQuery && matchesClass;
    });

    return (
        <>
            <div className="relative bg-white shadow-lg flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Manage Student Information</h1>
            </div>
            <div className="flex justify-center items-center mt-5">
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-4 py-2 w-full max-w-md">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input
                        type="search"
                        placeholder="Search Student by name..."
                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        value={query}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["All", "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((cls) => (
                    <button
                        key={cls}
                        className={`px-4 py-2 rounded-md ${selectedClass === cls ? "bg-blue-900 text-white" : "bg-gray-200"}`}
                        onClick={() => handleClassFilter(cls)}
                    >
                        {cls}
                    </button>
                ))}
            </div>
            <div className="overflow-x-auto border rounded-md mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="p-3 border text-center">Sr #</th>
                            <th className="p-3 border text-center">Class Level</th>
                            <th className="p-3 border text-center">Roll No</th>
                            <th className="p-3 border text-center">First Name</th>
                            <th className="p-3 border text-center">Last Name</th>
                            <th className="p-3 border text-center">Contact</th>
                            <th className="p-3 border text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length ? (
                            filteredStudents.map((student, index) => (
                                <tr key={student._id} className="border">
                                    <td className="p-3 border text-center">{index + 1}</td>
                                    <td className="p-3 border text-center">{student.classLevel}</td>
                                    <td className="p-3 border text-center">{student.rollNo}</td>
                                    <td className="p-3 border text-center">{student.firstName}</td>
                                    <td className="p-3 border text-center">{student.lastName}</td>
                                    <td className="p-3 border text-center">{student.contact}</td>
                                    <td className="p-3 border text-center flex justify-center gap-2">
                                        <button className="bg-blue-900 text-white p-4 rounded-full hover:bg-blue-800" onClick={() => handleEditDialog(student)}>
                                            <FaEdit size={16} />
                                        </button>
                                        <button className="bg-red-600 text-white p-4 rounded-full hover:bg-red-500" onClick={() => openDeleteAlert(student._id)}>
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center">No results found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showAlert && <AlertDialog onConfirm={handleAlertConfirm} onCancel={() => setShowAlert(false)} />}
            {showEditDialog && selectedStudent && <UpdateStudentInfoDialog student={selectedStudent} onSave={handleEditSave} onClose={() => setShowEditDialog(false)} />}
        </>
    );
}

export default ManageStudent;
