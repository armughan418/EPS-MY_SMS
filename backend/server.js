require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
let port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.ERONTEND_URL})); 


// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => console.error("❌ Database connection error:", err));

// Student Schema
const studentSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        bForm: { type: String, required: true },
        fatherName: { type: String, required: true },
        fatherCNIC: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String, required: true },
        fee: { type: Number, required: true },
        rollNo: { type: Number, required: true },
        dob: { type: Date, required: true },
        classLevel: {
            type: String,
            enum: [
                "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3",
                "Class 4", "Class 5", "Class 6", "Class 7", "Class 8",
                "Class 9", "Class 10"
            ],
            required: true,
        },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        nationality: { type: String, enum: ["Pakistan", "Others"], required: true },
        religion: { type: String, enum: ["Islam", "Christian", "Hindu", "Others"], required: true },
        dateOfAdmission: { type: Date, required: true },
        remainingFee: { type: Number, default: 0 },
        feeHistory: [{
            amount: { type: Number, required: true },
            status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
            date: { type: Date, default: Date.now },
            description: { type: String }
        }]
    },
    { timestamps: true }
);

studentSchema.pre('save', function (next) {
    if (!this.feeHistory || this.feeHistory.length === 0) {
        this.feeHistory = [{
            amount: this.fee,
            status: "unpaid",
            date: new Date(),
            description: "Initial fee"
        }];
        this.remainingFee = this.fee;
    }
    next();
});

const Student = mongoose.model("Student", studentSchema);

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// JWT Secret
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
if (SECRET_KEY === "your-secret-key") {
    console.warn("⚠ Using default JWT_SECRET. Please set a secure JWT_SECRET in production.");
}

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Student Routes
app.post("/students/api/students", async (req, res) => {
    try {
        const { firstName, lastName, bForm, fatherName, fatherCNIC, address, contact, fee, rollNo, dob, classLevel, gender, nationality, religion, dateOfAdmission } = req.body;
        if (!firstName || !lastName || !bForm || !fatherName || !fatherCNIC || !address || !contact || !fee || !rollNo || !dob || !classLevel || !gender || !nationality || !religion || !dateOfAdmission) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const studentData = {
            firstName, lastName, bForm, fatherName, fatherCNIC, address, contact,
            fee: Number(fee), rollNo: Number(rollNo), dob: new Date(dob),
            classLevel, gender, nationality, religion, dateOfAdmission: new Date(dateOfAdmission),
        };
        if (isNaN(studentData.fee) || isNaN(studentData.rollNo)) {
            return res.status(400).json({ message: "Fee and Roll No must be valid numbers" });
        }
        const student = await Student.create(studentData);
        res.status(201).json({ message: "Student added successfully!", student });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Failed to add student", error: error.message });
    }
});

app.get("/students/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
});

app.put("/students/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Student ID" });
        }
        const updateData = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                if (key === "fee" || key === "rollNo") {
                    updateData[key] = Number(value);
                    if (isNaN(updateData[key])) {
                        return res.status(400).json({ message: `${key} must be a valid number` });
                    }
                } else if (key === "dob" || key === "dateOfAdmission") {
                    updateData[key] = new Date(value);
                } else {
                    updateData[key] = value;
                }
            }
        }
        const student = await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Failed to update student", error: error.message });
    }
});

app.delete("/students/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Student ID" });
        }
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete student", error: error.message });
    }
});

// Fee Routes
app.get("/fees/api/students", async (req, res) => {
    try {
        const students = await Student.find().lean();
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
});

app.post("/fees/api/students/markFeePaid", async (req, res) => {
    try {
        const updates = Array.isArray(req.body) ? req.body : [req.body];
        if (!updates.length) {
            return res.status(400).json({ message: "No updates provided" });
        }

        const bulkOps = [];
        for (const { studentId, paidAmount, remainingFee } of updates) {
            if (!mongoose.Types.ObjectId.isValid(studentId)) {
                return res.status(400).json({ message: "Invalid student ID" });
            }
            const paid = Number(paidAmount);
            const remaining = Number(remainingFee);
            if (isNaN(paid) || paid < 0 || isNaN(remaining) || remaining < 0) {
                return res.status(400).json({ message: "Invalid amount" });
            }

            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
                .toLocaleString('default', { month: 'long' });

            const update = { $set: { remainingFee: remaining } };
            const feeHistoryUpdates = [];
            if (paid > 0) {
                feeHistoryUpdates.push({
                    amount: paid,
                    status: "paid",
                    date: new Date(),
                    description: `Fee paid for ${currentMonth}`
                });
            }
            if (remaining > 0) {
                feeHistoryUpdates.push({
                    amount: remaining,
                    status: "unpaid",
                    date: new Date(),
                    description: `Remaining fee for ${nextMonth}`
                });
            }
            if (feeHistoryUpdates.length) {
                update.$push = { feeHistory: { $each: feeHistoryUpdates } };
            }

            bulkOps.push({ updateOne: { filter: { _id: studentId }, update } });
        }

        if (bulkOps.length > 0) {
            await Student.bulkWrite(bulkOps);
            res.status(200).json({ message: "Fee updates processed successfully" });
        } else {
            res.status(400).json({ message: "No valid updates to process" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update fees", error: error.message });
    }
});


app.get("/fees/api/dashboard-stats", async (req, res) => {
    try {
        const students = await Student.find().lean();
        const stats = {
            totalStudents: students.length,
            maleStudents: students.filter(s => s.gender === "Male").length,
            femaleStudents: students.filter(s => s.gender === "Female").length,
            totalClasses: [...new Set(students.map(s => s.classLevel))].length,
            feePaid: students.filter(s => s.remainingFee === 0).length,
            feeNotPaid: students.filter(s => s.remainingFee > 0).length
        };
        res.status(200).json({ stats }); // Consistent response structure
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
    }
});

// Auth Routes
app.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: "2h" });
        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

app.post("/auth/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, username, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully!", id: user._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user", details: error.message });
    }
});

app.get("/auth/users", verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json({ users }); // Consistent response structure
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users", details: error.message });
    }
});

app.delete("/auth/users/:id", verifyToken, async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        if (usersCount <= 1) {
            return res.status(400).json({ error: "Cannot delete the last user" });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user", details: error.message });
    }
});

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the School Management API!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server with Port Fallback
const startServer = (currentPort) => {
    const server = app.listen(currentPort, () => {
        console.log(`🚀 Server running on port ${currentPort}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
            startServer(currentPort + 1);
        } else {
            console.error("Server error:", err);
        }
    });
};

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

startServer(port);
