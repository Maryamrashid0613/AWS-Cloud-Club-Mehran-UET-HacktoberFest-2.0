import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DriverAuthProvider } from "./context/DriverAuthContext";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <DriverAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DriverLogin />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
        </Routes>
      </Router>
    </DriverAuthProvider>
  );
}

export default App;
