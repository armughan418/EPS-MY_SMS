import Navbar from "./components/navbarComponents";
import NotFound from "./pages/notFound";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import AddStudent from "./pages/addStudent";
import GenerateChalan from "./pages/generateChalan";
import MenageStudent from "./pages/deleteStudent";
import { ToastContainer } from "react-toastify";
import MarkFee from "./pages/markFee";
import ViewFeeDetails from "./pages/viewFeeDetails";
import ViewChalan from "./pages/viewChalan";
import Settings from "./pages/settings";
import StudentDetails from "./pages/studentDetails";
import ViewAndDelete from "./pages/viewAndDelete";
import Login from "./pages/login";

// ✅ Protected Route: Token-based Authentication Check
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token"); // Check if token exists
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* ✅ Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <Dashboard />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/addStudent"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <AddStudent />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/generateChalan"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <GenerateChalan />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Menage-Student-Info"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <MenageStudent />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Mark-Fee"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <MarkFee />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Student-Details"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <StudentDetails />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/View-And-Delete"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <ViewAndDelete />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Fee-Details"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <ViewFeeDetails />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/fee-chalan"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <ViewChalan />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Navbar />
                                    <Settings />
                                </>
                            </ProtectedRoute>
                        }
                    />

                    {/* Not Found Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <ToastContainer />
            </BrowserRouter>
        </>
    );
}

export default App;
