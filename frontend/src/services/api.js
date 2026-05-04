const BASE_URL = "http://localhost:5000";

export const getEvents = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const registerEvent = async (eventId, token) => {
  const res = await fetch(`${BASE_URL}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};