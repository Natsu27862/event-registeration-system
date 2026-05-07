import { useState, useEffect } from "react";
import BASE_URL from "../services/api";

function Login({ onLogin, goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Moving Background */}
      <div style={styles.animatedBg}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
        <div style={styles.shape4}></div>
        <div style={styles.shape5}></div>
        <div style={styles.shape6}></div>
        <div style={styles.shape7}></div>
        <div style={styles.shape8}></div>
      </div>

      <div style={styles.card}>
        <div style={styles.gloss}></div>
        <div style={styles.logoWrapper}>
          <span style={styles.logoEmoji}>🎓</span>
        </div>
        <h1 style={styles.title}>Welcome to FestHub</h1>
        <p style={styles.subtitle}>Your college fest companion</p>

        <div style={styles.inputGroup}>
          <input
            type="email"
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            style={{ ...styles.loginBtn, opacity: isLoading ? 0.7 : 1 }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Don’t have an account?{" "}
            <span
              onClick={goToSignup}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f0c29",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  animatedBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  shape1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "rgba(102,126,234,0.3)",
    borderRadius: "50%",
    top: "10%",
    left: "-100px",
    animation: "move1 20s infinite",
  },
  shape2: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "rgba(236,72,153,0.3)",
    borderRadius: "50%",
    bottom: "10%",
    right: "-50px",
    animation: "move2 18s infinite",
  },
  shape3: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "rgba(139,92,246,0.2)",
    borderRadius: "50%",
    top: "40%",
    right: "20%",
    animation: "move3 25s infinite",
  },
  shape4: {
    position: "absolute",
    width: "150px",
    height: "150px",
    background: "rgba(34,197,94,0.2)",
    borderRadius: "50%",
    bottom: "20%",
    left: "15%",
    animation: "move4 15s infinite",
  },
  shape5: {
    position: "absolute",
    width: "250px",
    height: "250px",
    background: "rgba(245,158,11,0.2)",
    borderRadius: "50%",
    top: "60%",
    left: "30%",
    animation: "move5 22s infinite",
  },
  shape6: {
    position: "absolute",
    width: "180px",
    height: "180px",
    background: "rgba(239,68,68,0.2)",
    borderRadius: "50%",
    top: "15%",
    right: "25%",
    animation: "move6 17s infinite",
  },
  shape7: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background: "rgba(6,182,212,0.15)",
    borderRadius: "50%",
    bottom: "30%",
    right: "10%",
    animation: "move7 28s infinite",
  },
  shape8: {
    position: "absolute",
    width: "100px",
    height: "100px",
    background: "rgba(168,85,247,0.3)",
    borderRadius: "50%",
    top: "75%",
    left: "45%",
    animation: "move8 12s infinite",
  },
  card: {
    position: "relative",

    background: "rgba(255, 255, 255, 0.08)",

    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    border: "1px solid rgba(255, 255, 255, 0.2)",

    borderRadius: "40px",
    padding: "48px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",

    boxShadow:
      "0 25px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",

    zIndex: 10,
    animation: "cardEnter 0.6s ease-out",
    overflow: "hidden",
  },

  gloss: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "50%",
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
    pointerEvents: "none",
  },
  logoWrapper: {
    width: "90px",
    height: "90px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    animation: "float 3s ease-in-out infinite",
    boxShadow: "0 10px 25px rgba(102,126,234,0.3)",
  },
  logoEmoji: { fontSize: "48px" },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: "32px",
  },
  inputGroup: { marginBottom: "24px" },
  input: {
    width: "100%",
    padding: "16px",

    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",

    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "20px",

    color: "#fff",
    fontSize: "16px",
    marginBottom: "16px",
    boxSizing: "border-box",

    outline: "none",
  },

  loginBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  demoSection: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },
  demoTitle: { fontSize: "12px", color: "#999", marginBottom: "12px" },
  demoGrid: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  demoItem: {
    background: "#f3f4f6",
    padding: "8px 12px",
    borderRadius: "16px",
  },
  demoRole: { fontSize: "10px", color: "#666", display: "block" },
  demoCode: { fontSize: "12px", fontWeight: "bold", color: "#667eea" },
  userInfo: {
    background: "#f3f4f6",
    padding: "20px",
    borderRadius: "24px",
    marginBottom: "24px",
    textAlign: "left",
  },
  userInfoItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  userInfoLabel: { fontWeight: "500", color: "#666" },
  userInfoValue: { fontWeight: "600", color: "#333" },
  continueBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes move1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(50px, 30px) rotate(180deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  @keyframes move2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-40px, 50px) rotate(-180deg); }
    100% { transform: translate(0, 0) rotate(-360deg); }
  }
  @keyframes move3 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(60px, -30px) scale(1.2); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes move4 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(-30px, -40px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes move5 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(40px, 60px) rotate(90deg); }
    100% { transform: translate(0, 0) rotate(180deg); }
  }
  @keyframes move6 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-50px, -20px) scale(0.8); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes move7 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(70px, 40px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes move8 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(20px, -60px) rotate(180deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes cardEnter {
    from { opacity: 0; transform: scale(0.9) translateY(30px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default Login;
