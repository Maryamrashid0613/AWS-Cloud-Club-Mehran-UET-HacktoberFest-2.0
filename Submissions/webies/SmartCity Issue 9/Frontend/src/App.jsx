import { Routes, Route } from "react-router-dom";
import { Login, Signup, Home,ReportIssue ,DriverPortal} from "@/pages";
import PrivateRoute from "@/components/routes/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/driver" element={<DriverPortal />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route
          path="/"
          element={
            // <PrivateRoute>
              <Home />
            // </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
