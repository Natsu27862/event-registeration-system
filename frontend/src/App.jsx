import { useState } from "react";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name,
      role: payload.role
    };
  } catch {
    return null;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [isSignup, setIsSignup] = useState(false);

  const user = getUserFromToken();

  if (!isLoggedIn || !user) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

  if (isLoggedIn) {
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

  return isSignup ? (
    <Signup onSignup={() => setIsSignup(false)} />
  ) : (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      goToSignup={() => setIsSignup(true)}
    />
  );
}

export default App;