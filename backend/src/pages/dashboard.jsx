import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaFemale, FaMale, FaPlus, FaSchool, FaUserGraduate } from "react-icons/fa";
import { toast } from "react-toastify";


function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <span className="inline-block relative w-4 h-16 bg-blue-900 animate-scaleY"></span>
            <span className="inline-block relative w-4 h-16 bg-blue-900 animate-scaleY delay-150 ml-4"></span>
            <span className="inline-block relative w-4 h-16 bg-blue-900 animate-scaleY delay-300 ml-4"></span>
        </div>
    );
}

const Counter = ({ end, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Counter started with end value:", end);
        if (typeof end !== "number" || end < 0) {
            console.warn("Invalid end value for Counter:", end);
            setCount(0);
            return;
        }

        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                start = end;
            }
            setCount(Math.floor(start));
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count}</span>;
};

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        maleStudents: 0,
        femaleStudents: 0,
        totalClasses: 0,
        feePaid: 0,
        feeNotPaid: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fees/api/dashboard-stats`);
            console.log("Fetched dashboard stats:", response.data);
            setStats(response.data.stats); // Adjusted for new structure
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error.response?.data || error);
            toast.error("Failed to load dashboard stats");
            setLoading(false);
        }
    };

    const handleAddStudentClick = () => {
        navigate("/addStudent");
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
        }),
    };

    const cards = [
        { icon: <FaUserGraduate />, value: stats.totalStudents, title: "Total No. of Students" },
        { icon: <FaMale />, value: stats.maleStudents, title: "No. of Students (Boys)" },
        { icon: <FaFemale />, value: stats.femaleStudents, title: "No. of Students (Girls)" },
        { icon: <FaSchool />, value: stats.totalClasses, title: "No. of Classes" },
        { icon: <FaCheckCircle />, value: stats.feePaid, title: "No. of Students (Fee Paid)" },
        { icon: <FaExclamationCircle />, value: stats.feeNotPaid, title: "No. of Students (Fee Not Paid)" },
    ];

    return (
        <div>
            <div className="relative bg-white shadow-lg flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Dashboard</h1>
            </div>
            <div className="bg-gray-50 min-h-screen p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex justify-center gap-6 flex-wrap">
                        <AnimatePresence>
                            {cards.map((card, index) => (
                                <motion.div key={index} custom={index} initial="hidden" animate="visible" variants={cardVariants} className="bg-white w-full max-w-sm p-6 py-10 mt-7 rounded-md shadow-lg text-center">
                                    <div className="flex justify-end">
                                        <div className="border border-blue-900 rounded-full p-2 flex items-center justify-center w-12 h-12">
                                            {React.cloneElement(card.icon, { className: "text-blue-900" })}
                                        </div>
                                    </div>
                                    <h1 className="font-bold text-4xl md:text-6xl text-blue-950">
                                        <Counter end={card.value} />
                                    </h1>
                                    <h1 className="font-bold text-lg text-blue-900 mt-2">{card.title}</h1>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                <div className="flex justify-center items-center mt-8 gap-4 flex-wrap">
                    <button onClick={handleAddStudentClick} className="bg-blue-900 text-white flex justify-center items-center px-4 py-2 rounded-md shadow-lg">
                        <FaPlus className="mr-2 text-white" /> Add Student
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;