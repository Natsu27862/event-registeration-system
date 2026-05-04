export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>📍 {event.location}</p>
      <p>📅 {event.date}</p>

      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${event.filled}%` }}
        ></div>
      </div>

      <button className="register-btn">REGISTER</button>
    </div>
  );
}