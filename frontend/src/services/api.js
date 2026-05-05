const BASE_URL = "http://localhost:5000";

const handleAuthError = (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");

    window.location.reload();
    return true;
  }
  return false;
};

export const getEvents = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (handleAuthError(res)) return [];

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

export const getEventRegistrations = async (eventId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/events/${eventId}/participants`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (handleAuthError(res)) return [];

  return res.json();
};

export const createEvent = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (handleAuthError(res)) return [];

  return res.json();
};

export const deleteEvent = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (handleAuthError(res)) return [];

  return res.json();
};

export const closeEvent = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/events/${id}/close`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.reload();
    return null;
  }

  return res.json();
};