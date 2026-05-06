import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import EventModal from "../components/EventModal";
import { getEvents, registerEvent } from "../services/api";
import { useRef } from "react";

function HomePage({ user, onLogout, onViewCoordinator, onViewTeacher }) {
  const [eventsData, setEventsData] = useState([]);
  const [attended, setAttended] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clickRipple, setClickRipple] = useState(null);
  const [particles, setParticles] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const glowRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        if (Array.isArray(data)) {
          setEventsData(data);
        } else if (Array.isArray(data.events)) {
          setEventsData(data.events);
        } else {
          console.error("Invalid response:", data);
          setEventsData([]); // fallback
        }
      } catch (err) {
        console.error(err);
        setEventsData([]); // prevent crash
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const savedAttended = localStorage.getItem("attendedEvents");
    if (savedAttended) setAttended(JSON.parse(savedAttended));
  }, []);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }
    setParticles(newParticles);

    const newFloating = [];
    const emojis = ["🎭", "🎪", "🎮", "💻", "🎤", "🎨", "🏆", "🎯"];
    for (let i = 0; i < 15; i++) {
      newFloating.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 25,
        duration: Math.random() * 30 + 20,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.08 + 0.02,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setFloatingElements(newFloating);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };

      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e"],
    });
  };

  const handleAttend = (event) => {
    if (!attended.includes(event.id)) {
      setAttended([...attended, event.id]);
      localStorage.setItem(
        "attendedEvents",
        JSON.stringify([...attended, event.id]),
      );
      fireConfetti();
      toast.success(`🎉 You're attending ${event.title}!`, {
        style: { background: "#22c55e", color: "white" },
      });
    }
  };

  const handleRegister = async (event) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await registerEvent(event.id, token);

      if (res.message) {
        toast.success(res.message);
        setEventsData((prev) =>
          prev.map((e) =>
            e.id === event.id ? { ...e, isRegistered: true } : e,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setClickRipple(null), 500);
  };

  const liveEvents = eventsData.filter((e) => e.status === "OPEN");
  const allEvents = eventsData;

  const getCardGradient = (type, index) => {
    const gradients = {
      cultural: [
        "linear-gradient(135deg, #667eea, #764ba2)",
        "linear-gradient(135deg, #f093fb, #f5576c)",
      ],
      coding: [
        "linear-gradient(135deg, #4facfe, #00f2fe)",
        "linear-gradient(135deg, #43e97b, #38f9d7)",
      ],
      gaming: [
        "linear-gradient(135deg, #f5365c, #f56036)",
        "linear-gradient(135deg, #fc4a1a, #f7b733)",
      ],
      tech: [
        "linear-gradient(135deg, #11998e, #38ef7d)",
        "linear-gradient(135deg, #00b4db, #0083b0)",
      ],
    };
    return (gradients[type] || gradients.cultural)[index % 2];
  };

  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    useEffect(() => {
      const calculate = () => {
        const diff = new Date(targetDate) - new Date();
        if (diff <= 0)
          return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % 3600000) / (1000 * 60)),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      };
      calculate();
      const interval = setInterval(calculate, 1000);
      return () => clearInterval(interval);
    }, [targetDate]);
    return (
      <div
        style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            background: "#1f2937",
            padding: "4px 8px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "48px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            {timeLeft.days}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "9px" }}>Days</span>
        </div>
        <div
          style={{
            background: "#1f2937",
            padding: "4px 8px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "48px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            {timeLeft.hours}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "9px" }}>Hrs</span>
        </div>
        <div
          style={{
            background: "#1f2937",
            padding: "4px 8px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "48px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            {timeLeft.minutes}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "9px" }}>Mins</span>
        </div>
        <div
          style={{
            background: "#1f2937",
            padding: "4px 8px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "48px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            {timeLeft.seconds}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "9px" }}>Secs</span>
        </div>
      </div>
    );
  };

  const EventCard = ({ event, index }) => {
    const isDone = event.isRegistered;
    const gradient = getCardGradient(event.type, index);
    const isLive = event.status === "OPEN";

    return (
      <div
        className="event-card"
        style={{
          background: gradient,
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          opacity: 1,
        }}
        onClick={() => openModal(event)}
      >
        <div
          style={{
            position: "relative",
            height: "130px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: "60px" }} className="event-icon">
            🎉
          </div>
          {isLive && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "#ef4444",
                color: "white",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  background: "white",
                  borderRadius: "50%",
                  animation: "pulse 1s infinite",
                }}
              ></span>
              LIVE
            </div>
          )}
        </div>

        <div style={{ padding: "16px", background: "white" }}>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              marginBottom: "6px",
              color: "#1f2937",
            }}
          >
            {event.title}
          </h3>
          <p
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "3px" }}
          >
            📍 {event.location}
          </p>
          <p
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}
          >
            📅 {new Date(event.date).toLocaleDateString()}
          </p>
          <p
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}
          >
            👥 Max Participants: {event.maxParticipants}
          </p>

          {!isLive && new Date(event.date) > new Date() && (
            <CountdownTimer targetDate={event.date} />
          )}
          <button
            className="action-button"
            style={{
              width: "100%",
              padding: "9px",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              color: "white",
              background: isDone ? "#9ca3af" : "#f59e0b",
              cursor: isDone ? "not-allowed" : "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRipple(e);

              handleRegister(event);
            }}
            disabled={isDone}
          >
            {isDone ? "✅ Registered" : "📝 REGISTER"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a2a, #1a1a3a)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {clickRipple && (
        <div
          style={{
            position: "fixed",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.8)",
            transform: "scale(0)",
            animation: "rippleExpand 0.4s ease-out",
            pointerEvents: "none",
            zIndex: 1000,
            left: clickRipple.x,
            top: clickRipple.y,
          }}
        />
      )}

      <div
        ref={glowRef}
        style={{
          position: "fixed",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(102,126,234,0.08), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          transition: "left 0.03s, top 0.03s",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background:
                "radial-gradient(circle, rgba(102,126,234,0.5), transparent)",
              borderRadius: "50%",
              opacity: p.opacity,
              animation: `floatParticle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {floatingElements.map((f) => (
          <div
            key={f.id}
            style={{
              position: "absolute",
              left: `${f.x}%`,
              top: `${f.y}%`,
              fontSize: `${f.size}px`,
              opacity: f.opacity,
              animation: `floatEmoji ${f.duration}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          >
            {f.emoji}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(102,126,234,0.1), transparent)",
            borderRadius: "50%",
            top: "10%",
            left: "-10%",
            animation: "float1 20s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.08), transparent)",
            borderRadius: "50%",
            bottom: "0%",
            right: "-5%",
            animation: "float2 18s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07), transparent)",
            borderRadius: "50%",
            top: "50%",
            left: "20%",
            animation: "float3 25s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.05), transparent)",
            borderRadius: "50%",
            bottom: "20%",
            right: "20%",
            animation: "float4 22s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.06), transparent)",
            borderRadius: "50%",
            top: "70%",
            left: "70%",
            animation: "float5 28s infinite",
          }}
        />
      </div>

      {/* Hero Header */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px 30px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(102,126,234,0.15), transparent)",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: "60px",
              marginBottom: "15px",
              animation: "bounce 2s infinite",
            }}
          >
            🏛️
          </div>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              marginBottom: "10px",
              lineHeight: "1.2",
              background:
                "linear-gradient(135deg, #fff, #667eea, #764ba2, #f093fb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              letterSpacing: "2px",
            }}
          >
            JUIT Events 2026
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.8)",
              marginTop: "12px",
            }}
          >
            Where Memories Are Made ✨
          </p>
        </div>
      </div>

      {/* Navbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          padding: "12px 24px",
          borderRadius: "20px",

          background: "rgba(50, 50, 50, 0.25)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",

          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "28px" }}>🎓</span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FestHub
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "35px",
              height: "35px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <span style={{ fontWeight: "500", color: "#FFFFFF", fontSize: "14px" }}>
            👋 {user?.name || "User"}
          </span>
          {user.role === "coordinator" && (
            <button
              style={{
                padding: "6px 18px",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "40px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px",
              }}
              onClick={onViewCoordinator}
            >
              👨‍💼 Coordinator
            </button>
          )}
          {user.role === "teacher" && (
            <button
              style={{
                padding: "6px 18px",
                background: "#ec4899",
                color: "white",
                border: "none",
                borderRadius: "40px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px",
              }}
              onClick={onViewTeacher}
            >
              👨‍🏫 Teacher
            </button>
          )}
          <button
            style={{
              padding: "8px 16px",
  borderRadius: "12px",

  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.2)",

  color: "#fff",
  fontWeight: "500",

  cursor: "pointer",
  transition: "all 0.2s ease",
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div
        style={{
          textAlign: "center",
          padding: "30px 20px 15px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            padding: "5px 18px",
            borderRadius: "40px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "15px",
          }}
        >
          ✨ 2026 EDITION ✨
        </div>
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "8px",
          }}
        >
          Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}! 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px" }}>
          Discover amazing events happening around you!
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          padding: "30px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="stat-card"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: "18px",
            textAlign: "center",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "36px" }}>🎪</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {allEvents.length}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "6px",
            }}
          >
            Total Events
          </div>
        </div>
        <div
          className="stat-card"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: "18px",
            textAlign: "center",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "36px" }}>🔴</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {liveEvents.length}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "6px",
            }}
          >
            Live Now
          </div>
        </div>
        <div
          className="stat-card"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: "18px",
            textAlign: "center",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "36px" }}>✅</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {eventsData.filter((e) => e.isRegistered).length}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "6px",
            }}
          >
            You Attended
          </div>
        </div>
        <div
          className="stat-card"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            borderRadius: "18px",
            textAlign: "center",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "36px" }}>🏆</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {attended.length +
              eventsData.filter((e) => e.isRegistered).length >=
            3
              ? "🎖️"
              : "🌱"}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "6px",
            }}
          >
            {attended.length +
              eventsData.filter((e) => e.isRegistered).length >=
            3
              ? "Pro Attendee"
              : "Getting Started"}
          </div>
        </div>
      </div>

      {/* Live Events Section */}
      {liveEvents.length > 0 && (
        <div
          style={{ padding: "0 25px 40px", position: "relative", zIndex: 2 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{ position: "relative", width: "20px", height: "20px" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "40px",
                  height: "40px",
                  background: "rgba(239,68,68,0.3)",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: "pulseRing 1.5s infinite",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#ef4444",
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                }}
              />
            </div>
            <h2
              style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}
            >
              🔥 Live Now
            </h2>
            <div
              style={{
                flex: 1,
                height: "2px",
                background: "linear-gradient(90deg, #ef4444, transparent)",
              }}
            />
            <div
              style={{
                background: "rgba(239,68,68,0.2)",
                padding: "4px 12px",
                borderRadius: "30px",
                fontSize: "12px",
                color: "#ef4444",
                fontWeight: "bold",
              }}
            >
              {liveEvents.length} events
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {liveEvents.map((event, idx) => (
              <EventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* All Events Section */}
      <div style={{ padding: "0 25px 50px", position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <div style={{ fontSize: "24px" }}>🎪</div>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            All Events
          </h2>
          <div
            style={{
              flex: 1,
              height: "2px",
              background: "linear-gradient(90deg, #8b5cf6, transparent)",
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {allEvents.map((event, idx) => (
            <EventCard key={event.id} event={event} index={idx} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "25px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
          🎓 FestHub - JUIT Events 2026 | Where Every Moment Counts ✨
        </p>
        <div style={{ marginTop: "8px", fontSize: "18px", opacity: 0.4 }}>
          🎭 🎪 🎮 💻 🎤 🏆
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
          onAttend={handleAttend}
          onRegister={handleRegister}
          isAttended={attended.includes(selectedEvent?.id)}
          isRegistered={selectedEvent?.isRegistered}
        />
      )}
    </div>
  );
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(50px,30px) rotate(180deg); } }
  @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-40px,50px); } }
  @keyframes float3 { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15) translate(30px,-25px); } }
  @keyframes float4 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-25px,-40px); } }
  @keyframes float5 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(90deg) translate(25px,30px); } }
  @keyframes floatParticle { 0%,100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-25px) translateX(15px); } 50% { transform: translateY(0px) translateX(-15px); } 75% { transform: translateY(25px) translateX(15px); } }
  @keyframes floatEmoji { 0%,100% { transform: translateY(0px) rotate(0deg); } 25% { transform: translateY(-30px) rotate(8deg); } 50% { transform: translateY(0px) rotate(-8deg); } 75% { transform: translateY(30px) rotate(8deg); } }
  @keyframes rippleExpand { 0% { transform: scale(0); opacity: 0.6; } 100% { transform: scale(50); opacity: 0; } }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
  @keyframes pulseRing { 0%,100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; } }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

  /* NO TRANSFORM ON HOVER - JUST GLOW AND SHADOW (NO FLICKERING) */
  .event-card {
    transition: box-shadow 0.2s ease, filter 0.2s ease;
  }
  .event-card:hover {
    box-shadow: 0 12px 28px rgba(0,0,0,0.35);
    filter: brightness(1.02);
  }
  .event-card:hover .event-icon {
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }
  .action-button {
    transition: transform 0.15s ease;
  }
  .action-button:active {
    transform: scale(0.98);
  }
  .stat-card {
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    background: rgba(255,255,255,0.2) !important;
  }
  button {
    transition: transform 0.15s ease, filter 0.15s ease;
  }
  button:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;
document.head.appendChild(styleSheet);

export default HomePage;
