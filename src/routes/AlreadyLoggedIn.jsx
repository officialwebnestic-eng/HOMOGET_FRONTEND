import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// AlreadyLoggedInRedirect.jsx
const AlreadyLoggedIn = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default AlreadyLoggedIn;
