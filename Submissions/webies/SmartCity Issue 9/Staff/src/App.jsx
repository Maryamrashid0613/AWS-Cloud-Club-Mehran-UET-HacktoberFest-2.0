import { Routes, Route } from "react-router-dom";
import ReportsProfile from "./pages/ReportsProfile";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ResolvedReports from "./pages/ResolvedReports";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <Navbar />

      <main className="mx-auto">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reportsprofile" element={<ReportsProfile />} />
          <Route path="/resolvedreports" element={<ResolvedReports />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
