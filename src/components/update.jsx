import React, { useState } from "react";

const UpdateStudentInfoDialog = ({ student, onSave, onClose }) => {
    const [updatedStudent, setUpdatedStudent] = useState({ ...student });

    const handleChange = (e) => {
        setUpdatedStudent({ ...updatedStudent, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(updatedStudent);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4 text-blue-900">Edit Student</h2>
                <form onSubmit={handleSubmit}>

                    {/* Grid for Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="First Name" name="firstName" value={updatedStudent.firstName} onChange={handleChange} />
                        <InputField label="Last Name" name="lastName" value={updatedStudent.lastName} onChange={handleChange} />
                        <InputField label="B-Form No" name="bForm" value={updatedStudent.bForm} onChange={handleChange} />
                        <InputField label="Father Name" name="fatherName" value={updatedStudent.fatherName} onChange={handleChange} />
                        <InputField label="Father CNIC" name="fatherCNIC" value={updatedStudent.fatherCNIC} onChange={handleChange} />
                        <InputField label="Address" name="address" value={updatedStudent.address} onChange={handleChange} />
                        <InputField label="Contact" name="contact" value={updatedStudent.contact} onChange={handleChange} />
                        <InputField label="Fee" name="fee" type="number" value={updatedStudent.fee} onChange={handleChange} />
                        <InputField label="Roll No" name="rollNo" type="number" value={updatedStudent.rollNo} onChange={handleChange} />
                        <InputField label="Date of Birth" name="dob" type="date" value={updatedStudent.dob} onChange={handleChange} />
                        <InputField label="Date of Admission" name="dateOfAdmission" type="date" value={updatedStudent.dateOfAdmission} onChange={handleChange} />
                    </div>

                    {/* Dropdown Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Dropdown label="Class" name="classLevel" value={updatedStudent.classLevel} options={["Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]} onChange={handleChange} />
                        <Dropdown label="Gender" name="gender" value={updatedStudent.gender} options={["Male", "Female"]} onChange={handleChange} />
                        <Dropdown label="Nationality" name="nationality" value={updatedStudent.nationality} options={["Pakistan", "Others"]} onChange={handleChange} />
                        <Dropdown label="Religion" name="religion" value={updatedStudent.religion} options={["Islam", "Christian", "Hindu", "Others"]} onChange={handleChange} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-6 gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// Reusable Input Field Component
const InputField = ({ label, name, type = "text", value, onChange }) => (
    <div className="relative w-full">
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            className="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-slate-900 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none"
        />
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-900 peer-focus:text-sm">
            {label}
        </label>
    </div>
);

// Reusable Dropdown Component
const Dropdown = ({ label, name, value, options, onChange }) => (
    <div className="relative w-full">
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 py-3 text-sm text-slate-900 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none cursor-pointer"
        >
            <option value="" disabled>{label}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default UpdateStudentInfoDialog;
