import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust the path if needed

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />; // redirect to login if not logged in
  }

  return children;
};

export default ProtectedRoute;
