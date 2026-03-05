import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
