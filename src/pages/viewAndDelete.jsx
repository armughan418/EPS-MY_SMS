import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";

function AlertDialog({ title, description, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-gray-600">{description}</p>
                <div className="mt-4 flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-900 text-white rounded">Delete</button>
                </div>
            </div>
        </div>
    );
}

function UserTable() {
    const [users, setUsers] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const baseUrl = `${process.env.REACT_APP_BACKEND_URL}`; // Correct base URL

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }
            const response = await fetch(`${baseUrl}/auth/users`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log("Fetched users:", data);
            setUsers(data.users); // Adjusted for consistent backend response { users: [...] }
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error(err.message || "Failed to load users");
        }
    };

    const deleteUser = async (id) => {
        if (users.length === 1) {
            toast.error("You cannot delete the last user!");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }
            const response = await fetch(`${baseUrl}/auth/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete user: ${response.status} - ${errorText}`);
            }
            setUsers(users.filter((user) => user._id !== id));
            toast.success("User deleted successfully");
            fetchUsers(); // Refetch to ensure sync with backend
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error(err.message || "Failed to delete user");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
            <div className="bg-white shadow-lg shadow-gray-300 w-full max-w-4xl px-6 py-4 rounded-md">
                <h1 className="text-xl font-bold text-blue-900">User Management</h1>
            </div>
            <div className="bg-white shadow-md w-full max-w-4xl mt-6 p-6 rounded-md overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="border border-gray-300 px-4 py-2">Sr #</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Username</th>
                            <th className="border border-gray-300 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex justify-center">
                                        <button
                                            className="bg-blue-900 text-white p-2 hover:bg-blue-800 transition flex items-center justify-center gap-2 rounded-md"
                                            onClick={() => {
                                                if (users.length === 1) {
                                                    toast.error("You cannot delete the last user!");
                                                    return;
                                                }
                                                setUserToDelete(user._id);
                                                setShowDialog(true);
                                            }}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showDialog && (
                <AlertDialog
                    title="Confirm Delete"
                    description="Are you sure you want to delete this user?"
                    onConfirm={() => {
                        deleteUser(userToDelete);
                        setShowDialog(false);
                    }}
                    onCancel={() => setShowDialog(false)}
                />
            )}
        </div>
    );
}

export default UserTable;
