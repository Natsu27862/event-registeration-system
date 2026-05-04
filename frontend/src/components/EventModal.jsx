export default function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
        <h2>{event.name}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}