import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function AddStudent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bForm, setBForm] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [fatherCNIC, setFatherCNIC] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [fee, setFee] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [dob, setDob] = useState("");
    const [classLevel, setClassLevel] = useState("");
    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("");
    const [religion, setReligion] = useState("");
    const [dateOfAdmission, setDateOfAdmission] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construct payload matching backend schema
        const payload = {
            firstName,
            lastName,
            bForm,
            fatherName,
            fatherCNIC,
            address,
            contact,
            fee: Number(fee), // Ensure number
            rollNo: Number(rollNo), // Ensure number
            dob,
            classLevel,
            gender,
            nationality,
            religion,
            dateOfAdmission,
        };

        // Log payload for debugging
        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        // Validate required fields
        const requiredFields = [
            "firstName", "lastName", "bForm", "fatherName", "fatherCNIC", "address",
            "contact", "fee", "rollNo", "dob", "classLevel", "gender", "nationality",
            "religion", "dateOfAdmission"
        ];
        const missingFields = requiredFields.filter(
            (field) => !payload[field] || payload[field] === "" || (typeof payload[field] === "number" && isNaN(payload[field]))
        );
        if (missingFields.length > 0) {
            console.error("Missing or invalid fields:", missingFields);
            toast.error(`Please fill all required fields correctly: ${missingFields.join(", ")}`);
            setLoading(false);
            return;
        }

        // Validate enum values
        const validClassLevels = ["Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
        const validGenders = ["Male", "Female"];
        const validNationalities = ["Pakistan", "Others"];
        const validReligions = ["Islam", "Christian", "Hindu", "Others"];
        if (!validClassLevels.includes(classLevel)) {
            toast.error("Invalid class level selected");
            setLoading(false);
            return;
        }
        if (!validGenders.includes(gender)) {
            toast.error("Invalid gender selected");
            setLoading(false);
            return;
        }
        if (!validNationalities.includes(nationality)) {
            toast.error("Invalid nationality selected");
            setLoading(false);
            return;
        }
        if (!validReligions.includes(religion)) {
            toast.error("Invalid religion selected");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/students/api/students`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Server response:", response.data);
            toast.success("Student added successfully!");
            resetForm();
        } catch (error) {
            console.error("Error adding student:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            toast.error(error.response?.data?.message || "Failed to add student");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setBForm("");
        setFatherName("");
        setFatherCNIC("");
        setAddress("");
        setContact("");
        setFee("");
        setRollNo("");
        setDob("");
        setClassLevel("");
        setGender("");
        setNationality("");
        setReligion("");
        setDateOfAdmission("");
    };

    return (
        <>
            <div className="relative bg-white shadow-lg flex justify-between items-center py-3 px-20 rounded-md">
                <h1 className="font-bold text-blue-900">Add Student</h1>
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                    <form onSubmit={submitHandler}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InputField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            <InputField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            <InputField label="B-Form Number" value={bForm} onChange={(e) => setBForm(e.target.value)} required />
                            <InputField label="Father Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />
                            <InputField label="Father CNIC" value={fatherCNIC} onChange={(e) => setFatherCNIC(e.target.value)} required />
                            <InputField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            <InputField label="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} required />
                            <InputField label="Fee" type="number" value={fee} onChange={(e) => setFee(e.target.value)} required />
                            <InputField label="Roll No" type="number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
                            <InputField label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                            <InputField label="Date of Admission" type="date" value={dateOfAdmission} onChange={(e) => setDateOfAdmission(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <Dropdown
                                label="Select Class"
                                options={["Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]}
                                value={classLevel}
                                onChange={(e) => setClassLevel(e.target.value)}
                                required
                            />
                            <Dropdown
                                label="Select Gender"
                                options={["Male", "Female"]}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            />
                            <Dropdown
                                label="Select Nationality"
                                options={["Pakistan", "Others"]}
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                required
                            />
                            <Dropdown
                                label="Select Religion"
                                options={["Islam", "Christian", "Hindu", "Others"]}
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-blue-900 text-white py-2 px-6 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"}`}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

const InputField = ({ label, type = "text", value, onChange, required }) => (
    <div className="relative w-full">
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder=" "
            required={required}
            className="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-slate-900 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none"
        />
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-900 peer-focus:text-sm">
            {label}
        </label>
    </div>
);

const Dropdown = ({ label, options, value, onChange, required }) => (
    <div className="relative w-full">
        <select
            value={value}
            onChange={onChange}
            required={required}
            className="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 py-3 text-sm text-slate-900 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none cursor-pointer"
        >
            <option value="" disabled>{label}</option>
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default AddStudent;
