import { useState } from "react";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isSignup, setIsSignup] = useState(false);

  const user = getUserFromToken();

  if (!isLoggedIn) {
    return isSignup ? (
      <Signup
        onSignup={() => setIsSignup(false)}
        goToLogin={() => setIsSignup(false)}
      />
    ) : (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        goToSignup={() => setIsSignup(true)}
      />
    );
  }

  if (!user) {
    localStorage.removeItem("token");
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        goToSignup={() => setIsSignup(true)}
      />
    );
  }

 if (user.role === "ADMIN") {
  return (
    <CoordinatorDashboard
      user={user}
      onBack={() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }}
    />
  );
}
console.log("USER FROM TOKEN:", user);

return (
  <HomePage
    user={user}
    onLogout={() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }}
  />
);
}

export default App;
