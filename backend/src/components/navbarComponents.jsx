import React, { useState } from 'react';
import { FaTachometerAlt, FaSignOutAlt, FaDollarSign, FaUserGraduate, FaTrash, FaPencilAlt, FaRegCheckSquare, FaFileInvoiceDollar } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa';
import { MdDashboard, MdManageAccounts, MdOutlineMoreVert } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai'

function dropDown() {
    return (
        <select>
            <option value="Logout"></option>
        </select>
    )
}


const Navbar = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <>
            <nav className="bg-blue-900">
                <div className="flex justify-between items-center pl-11 pr-11">
                    <div className="flex h-16 justify-center items-center gap-5 ">
                        {/* Hamburger Menu */}
                        <div className="">
                            <button
                                type="button"
                                className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white mt-3"
                                onClick={toggleSidebar}
                            >
                                <span className="sr-only">Toggle sidebar</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Centered Logo */}
                        <div className="">
                            <h1 className="text-white font-bold text-2xl">Excellent Public School</h1>
                        </div>

                    </div>
                    {/* Notifications and Profile */}
                    <div className="flex items-center space-x-4">
                        {/* Notification Icon */}
                        <button
                            type="button"
                            className="rounded-full bg-white p-1 text-black hover:focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <span className="sr-only">View notifications</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                />
                            </svg>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                id="user-menu-button"
                                aria-haspopup="true"
                                onClick={dropDown}
                            >
                                <span className="sr-only">Open user menu</span>
                                <FaUser className="h-9 w-9 rounded-full border-gray-800 bg-white p-1 text-blue-900 hover:focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-blue-900" size={40} color="black" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            {showSidebar && (
                <div className="fixed inset-0 z-40 flex">
                    <div className="bg-white w-64 h-full shadow-lg">
                        {/* Sidebar Header */}
                        <div className='flex flex-col justify-center px-4 py-4 border-b border-gray-700 bg-blue-900'>
                            <div className="flex justify-between items-center ">
                                <h2 className="text-black font-bold text-lg"></h2>
                                <button
                                    className="text-white text-3xl"
                                    onClick={toggleSidebar}
                                >
                                    &times;
                                </button>
                            </div>
                            <div>
                                <div className='flex justify-center items-center mt-5 flex-col gap-2'>
                                    <FaUser className="h-16 w-16 p- rounded-full border-blue-900 bg-white p-1 text-blue-900 hover:focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-blue-900" size={40} color="black" />
                                    <h1 className='font-bold text-white'>Administration</h1>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Links */}
                        <div className="px-4 py-6">
                            <ul className="space-y-4">
                                <li >
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/"
                                            className="flex items-center text-gray-800 hover:text-black"
                                        >
                                            <MdDashboard className="mr-3 text-blue-900" />
                                            Dashboard
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/AddStudent" className="flex items-center text-gray-800 hover:text-black">
                                            <FaUserGraduate className="mr-3 text-blue-900" />
                                            Add Student
                                        </Link>
                                    </div>
                                </li>
                                {/* remove student  */}
                                <li>
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/Menage-Student-Info" className="flex items-center text-gray-800 hover:text-black">
                                            <MdManageAccounts className="mr-3 text-blue-900" />
                                            Manage Student Info
                                        </Link>
                                    </div>
                                </li>
                                {/* mark  fee (paid/unpaid)  */}
                                <li>
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/Mark-Fee" className="flex items-center text-gray-800 hover:text-black">
                                            <FaRegCheckSquare className="mr-3 text-blue-900" />
                                            Mark Student Fee
                                        </Link>
                                    </div>
                                </li>
                                {/* view fee details */}
                                <li>
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/Fee-Details" className="flex items-center text-gray-800 hover:text-black">
                                            <FaDollarSign className="mr-3 text-blue-900" />
                                            View Fee Details
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/Student-Details" className="flex items-center text-gray-800 hover:text-black">
                                            <AiOutlineEye className="mr-3 text-blue-900" />
                                            View Student Details
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2">
                                        <Link
                                            to="/generateChalan"
                                            className="flex items-center text-gray-800 hover:text-black"
                                        >
                                            <FaFileInvoice className="mr-3 text-blue-900" />
                                            Generate Chalan Form
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2">
                                        <Link
                                            to="/settings"
                                            className="flex items-center text-gray-800 hover:text-black"
                                        >
                                            <FaCog className="mr-3 text-blue-900" />
                                            Settings
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className='hover:bg-gray-200 rounded-full pt-2 pb-2 pr-1 pl-2'>
                                        <Link to="/login"
                                            className="flex items-center text-gray-800 hover:text-black "
                                        >
                                            <FaSignOutAlt className="mr-3 text-blue-900" />
                                            Logout
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Overlay to close the sidebar */}
                    <div
                        className="flex-1 bg-black bg-opacity-50"
                        onClick={toggleSidebar}
                    ></div>
                </div>
            )}
        </>
    );
};

export default Navbar;
