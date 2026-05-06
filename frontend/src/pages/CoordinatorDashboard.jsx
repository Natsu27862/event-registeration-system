import { useState, useEffect } from "react";
import {
  getEvents,
  getEventRegistrations,
  createEvent,
  deleteEvent,
  closeEvent,
  openEvent,
} from "../services/api";

function CoordinatorDashboard({ user, onBack }) {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    maxParticipants: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEvents = await getEvents();
        if (Array.isArray(allEvents)) {
          setEvents(allEvents);
        } else {
          console.error("Invalid events response:", allEvents);
          setEvents([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);

    try {
      const regs = await getEventRegistrations(event.id);
      setRegistrations(regs.participants || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...form,
        maxParticipants: Number(form.maxParticipants),
      };

      console.log("SENDING:", payload);

      const res = await createEvent(payload);

      console.log("Created:", res);

      const updated = await getEvents();
      setEvents(updated);

      setShowForm(false);

      setForm({
        title: "",
        location: "",
        date: "",
        maxParticipants: "",
        description: "",
      });
      console.log("SENDING:", payload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEvent = async () => {
    try {
      await openEvent(selectedEvent.id);

      const updated = await getEvents();
      setEvents(updated);

      const updatedEvent = updated.find((e) => e.id === selectedEvent.id);
      setSelectedEvent(updatedEvent);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseEvent = async () => {
    try {
      await closeEvent(selectedEvent.id);

      const updated = await getEvents();
      setEvents(updated);

      const updatedEvent = updated.find((e) => e.id === selectedEvent.id);
      setSelectedEvent(updatedEvent);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      await deleteEvent(selectedEvent.id);

      const updated = await getEvents();
      setEvents(updated);

      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedEvent) {
    return (
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          background: "#0f0c29",
        }}
      >
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
              All Events
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.8)",
                marginTop: "12px",
              }}
            >
              Cordinator's Dashboard
            </p>
          </div>
        </div>
        {/* NAVBAR */}
        {showForm && (
          <div style={styles.modalOverlay}>
            <div style={styles.formCard}>
              <h2 style={{ color: "#fff" }}>Create Event</h2>

              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                type="number"
                placeholder="Capacity"
                value={form.maxParticipants}
                onChange={(e) =>
                  setForm({ ...form, maxParticipants: e.target.value })
                }
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button onClick={handleCreate}>Create</button>

              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div style={styles.navbar}>
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

          <div style={styles.navRight}>
            <div style={styles.avatar}>{user.name.charAt(0)}</div>
            <span>👋 {user.name}</span>
            <button style={styles.createBtn} onClick={() => setShowForm(true)}>
              + Create Event
            </button>

            <button style={styles.logoutBtn} onClick={onBack}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.headerRight}></div>
          </div>

          <div style={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event.id} style={styles.eventCard}>
                <h2 style={styles.eventTitle}>{event.title}</h2>
                <p style={styles.eventMeta}>📍 {event.location}</p>
                <p style={styles.eventMeta}>
                  👥 {event.maxParticipants} capacity
                </p>

                <button
                  style={styles.viewBtn}
                  onClick={() => handleSelectEvent(event)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const crowdCount = registrations.length;
  const capacity = selectedEvent.maxParticipants || 1;

  const crowdPercentage = Math.round((crowdCount / capacity) * 100);
  const getCrowdStatus = () => {
    if (crowdPercentage < 30)
      return { text: "Low", color: "#22c55e", icon: "🟢" };
    if (crowdPercentage < 60)
      return { text: "Medium", color: "#eab308", icon: "🟡" };
    if (crowdPercentage < 85)
      return { text: "High", color: "#f97316", icon: "🟠" };
    return { text: "Full", color: "#ef4444", icon: "🔴" };
  };
  const crowdStatus = getCrowdStatus();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0f0c29",
      }}
    >
      {/* SAME ANIMATED BACKGROUND */}
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

      {/* DASHBOARD CONTENT */}
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => setSelectedEvent(null)}>
            ← Back to Events
          </button>
          <h1 style={styles.title}>Coordinator Dashboard</h1>
          <div style={styles.headerRight}>
            <span style={styles.userBadge}>👋 {user.name}</span>
          </div>
        </div>

        {/* Event Info Banner */}
        <div style={styles.eventBanner}>
          <div>
            <h2 style={styles.eventName}>
              {selectedEvent.icon} {selectedEvent.title}
            </h2>
            <p style={styles.eventVenue}>📍 {selectedEvent.location}</p>
            <p style={styles.eventTime}>
              ⏰ {new Date(selectedEvent.date).toLocaleString()}
            </p>
          </div>
          <div style={styles.liveBadge}>🔴 LIVE</div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{crowdCount}</div>
            <div style={styles.statLabel}>Current Crowd</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{selectedEvent.maxParticipants}</div>
            <div style={styles.statLabel}>Capacity</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{crowdPercentage}%</div>
            <div style={styles.statLabel}>Fullness</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{registrations.length}</div>
            <div style={styles.statLabel}>Committee In</div>
          </div>
        </div>

        {/* Crowd Control Section */}
        <div style={styles.crowdSection}>
          <h3 style={styles.sectionTitle}>📊 Crowd Management</h3>
          <div style={styles.crowdCard}>
            <div style={styles.crowdStatusRow}>
              <span style={{ color: crowdStatus.color }}>
                {crowdStatus.icon} {crowdStatus.text} Crowd
              </span>
              <span>{crowdPercentage}% filled</span>
            </div>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${crowdPercentage}%`,
                  background: crowdStatus.color,
                }}
              />
            </div>
            <div style={styles.eventActions}>
              <button
                style={{
                  ...styles.fullWidthBtn,
                  ...styles.openBtn,
                  opacity: selectedEvent.status === "OPEN" ? 0.6 : 1,
                  cursor:
                    selectedEvent.status === "OPEN" ? "not-allowed" : "pointer",
                }}
                onClick={handleOpenEvent}
                disabled={selectedEvent.status === "OPEN"}
              >
                Open Registration
              </button>
              <button
                style={{
                  ...styles.fullWidthBtn,
                  ...styles.closeBtn,
                  opacity: selectedEvent.status === "CLOSED" ? 0.6 : 1,
                  cursor:
                    selectedEvent.status === "CLOSED"
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleCloseEvent}
                disabled={selectedEvent.status === "CLOSED"}
              >
                Close Event
              </button>

              <button
                style={{
                  ...styles.fullWidthBtn,
                  ...styles.deleteBtn,
                }}
                onClick={handleDeleteEvent}
              >
                Delete Event
              </button>
            </div>

            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              👥 {crowdCount} / {capacity} participants
            </div>
          </div>
        </div>
      </div>

      {/* Committee Members List */}
      <div style={styles.membersSection}>
        <div style={styles.membersHeader}>
          <h3 style={styles.sectionTitle}>
            👥 Registered Students ({registrations.length})
          </h3>
        </div>

        <div style={styles.membersList}>
          {registrations.map((reg) => (
            <div key={reg.id} style={styles.memberCard}>
              <div>
                <div style={styles.memberName}>{reg.user.name}</div>
                <div style={styles.memberRole}>{reg.user.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  eventActions: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  fullWidthBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "600",
    border: "none",
  },

  closeBtn: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
  },

  deleteBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
  },
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  eventCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    color: "#fff",
    transition: "0.3s",
    cursor: "pointer",
  },

  eventTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  logoutBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
  },

  eventMeta: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "6px",
  },

  viewBtn: {
    marginTop: "12px",
    padding: "10px",
    width: "100%",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
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
  container: {
    minHeight: "100vh",
    padding: "24px",
    position: "relative",
    zIndex: 10,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },

  createBtn: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    fontWeight: "600",
  },

  openBtn: {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
},

  backBtn: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    fontWeight: "600",
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userBadge: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "40px",
    fontWeight: "500",
  },
  eventBanner: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },
  eventName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  eventVenue: {
    fontSize: "14px",
    marginBottom: "4px",
  },
  eventTime: {
    fontSize: "14px",
  },
  liveBadge: {
    background: "#ef4444",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    marginTop: "4px",
  },
  crowdSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "12px",
  },
  crowdCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  crowdStatusRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },
  progressBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "16px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.5s ease",
  },
  crowdButtons: {
    display: "flex",
    gap: "12px",
  },
  crowdBtn: {
    padding: "8px 20px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  reinforceBtn: {
    padding: "8px 20px",
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    flex: 1,
  },
  qrSection: {
    marginBottom: "24px",
  },
  qrCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  qrBtn: {
    padding: "10px 20px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    width: "100%",
  },
  qrCode: {
    marginTop: "16px",
    textAlign: "center",
  },
  qrBox: {
    display: "inline-block",
    background: "#f3f4f6",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  qrPlaceholder: {
    fontSize: "60px",
    marginBottom: "8px",
  },
  qrText: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.7)",
  },
  qrNote: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "12px",
  },
  membersSection: {
    marginBottom: "24px",
  },
  membersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  reminderBtn: {
    padding: "8px 16px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  membersList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  memberCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "16px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  memberName: {
    fontWeight: "bold",
    color: "#fff",
  },
  memberRole: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.7)",
  },
  checkTime: {
    fontSize: "11px",
    color: "#22c55e",
    marginTop: "4px",
  },
  markBtn: {
    padding: "8px 16px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  absentBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  noEventContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  noEventCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    maxWidth: "400px",
  },
  noEventEmoji: {
    fontSize: "64px",
    marginBottom: "16px",
  },

  hero: {
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    padding: "60px 20px",
    textAlign: "center",
    color: "white",
  },

  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "10px 0",
  },

  heroSubtitle: {
    fontSize: "18px",
    opacity: 0.8,
  },

  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "12px 24px",
    borderRadius: "20px",

    background: "rgba(30, 30, 30, 0.6)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",

    border: "1px solid rgba(255,255,255,0.08)",

    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#fff",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "12px",

    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.2)",

    color: "#fff",
    fontWeight: "500",

    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },

  formCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
};

export default CoordinatorDashboard;
