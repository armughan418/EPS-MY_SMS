import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AlertDialog({ title, description, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-gray-600">{description}</p>
                <div className="mt-4 flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserTable() {
    const [users, setUsers] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newUser, setNewUser] = useState({ email: "", username: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please log in.");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
            console.log("Fetched users:", response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error);
            toast.error(error.message || "Failed to fetch users");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const saveUser = async () => {
        if (!newUser.email || !newUser.username || !newUser.password) {
            toast.error("All fields are required!");
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, newUser);
            if (response.status === 201) {
                setUsers([...users, { ...newUser, _id: response.data.id }]); // Adjusted to _id
                setNewUser({ email: "", username: "", password: "" });
                toast.success("User added successfully!");
            }
        } catch (error) {
            console.error("Error saving user:", error.response?.data || error);
            toast.error(error.response?.data?.error || "Failed to save user");
        }
    };

    const handleNavigation = () => navigate("/View-And-Delete");

    const confirmDelete = async () => {
        if (users.length === 1) {
            toast.error("You cannot delete the last user!");
            setShowDialog(false);
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/auth/users/${userToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user._id !== userToDelete));
            toast.success("User deleted successfully");
            fetchUsers(); // Refetch to ensure sync
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error);
            toast.error("Failed to delete user");
        } finally {
            setShowDialog(false);
            setUserToDelete(null);
        }
    };

    return (
        <>
            <div className="relative bg-white shadow-lg shadow-gray-300 flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Settings</h1>
                <button className="bg-blue-900 text-white p-2 rounded-md" onClick={handleNavigation}>
                    View and Delete user
                </button>
            </div>
            <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
                <div className="bg-white shadow-lg shadow-gray-300 w-full max-w-4xl px-6 py-4 rounded-md">
                    <h1 className="text-xl font-bold text-blue-900 flex justify-center">User Management</h1>
                </div>
                <div className="bg-white shadow-md w-full max-w-4xl mt-6 p-6 rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Add New User</h2>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            placeholder="Enter your Email"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            placeholder="Enter Username"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                            className="border p-2 rounded"
                            required
                        />
                        <button
                            className="bg-blue-900 text-white p-2 rounded hover:bg-blue-800 transition"
                            onClick={saveUser}
                        >
                            Save
                        </button>
                    </div>
                </div>
                {showDialog && (
                    <AlertDialog
                        title="Confirm Delete"
                        description="Are you sure you want to delete this user?"
                        onConfirm={confirmDelete}
                        onCancel={() => setShowDialog(false)}
                    />
                )}
            </div>
        </>
    );
}

export default UserTable;
