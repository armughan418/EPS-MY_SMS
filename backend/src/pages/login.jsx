import React, { useState } from "react";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, { username, password });
            console.log("Login response:", response.data);
            if (response.status === 200) {
                toast.success("Login successful!");
                localStorage.setItem("token", response.data.token);
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error);
            toast.error(error.response?.data?.error || "Invalid username or password!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 via-indigo-700 to-pink-600">
            <div className="bg-white shadow-lg rounded-2xl flex w-3/4 max-w-4xl overflow-hidden flex-wrap">
                <div className="w-1/2 bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex flex-col justify-center items-center p-8">
                    <h1 className="text-2xl font-bold">Welcome to</h1>
                    <h1 className="text-3xl font-bold">Excellent Public School</h1>
                    <p className="mt-2 text-gray-200">Sign in to continue access</p>
                </div>
                <div className="w-1/2 p-10 flex flex-col justify-center flex-wrap">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sign In</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="flex items-center border-b border-gray-300 py-2">
                            <FaUser className="text-gray-500 mx-2" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="bg-transparent outline-none flex-1"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center border-b border-gray-300 py-2">
                            <FaLock className="text-gray-500 mx-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="bg-transparent outline-none flex-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg mt-4 hover:opacity-90 transition flex gap-2 items-center justify-center"
                        >
                            Login <FaArrowRight className="ml-2" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
