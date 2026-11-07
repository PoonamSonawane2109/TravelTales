import { useEffect, useState } from "react";
import "./App.css";
import Registration from "./Registration";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProfilePage from "./ProfilePage";
import ContactUs from "./ContactUs";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  if (path === "/dashboard") {
    return <Dashboard onNavigate={navigate} />;
  }

  if (path === "/profile") {
    return <ProfilePage onNavigate={navigate} />;
  }

  if (path === "/contact-us") {
    return localStorage.getItem("token")
      ? <ContactUs onNavigate={navigate} />
      : <Login onLoginSuccess={() => navigate("/contact-us")} />;
  }

  if (path === "/register") {
    return <Registration onRegisterSuccess={() => navigate("/login")} />;
  }

  return <Login onLoginSuccess={() => navigate("/dashboard")} />;
}

export default App;