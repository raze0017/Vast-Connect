require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const http = require("http");

const passport = require("passport");
const express = require("express");
const cors = require("cors");

const passportConfig = require("./utils/configs/passport-config");
const socketSetup = require("./utils/middlewares/socket");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const postsRoutes = require("./routes/postsRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const realmsRoutes = require("./routes/realmsRoutes");
const imagesRoutes = require("./routes/imagesRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const jobsRouter = require("./routes/jobs");
const employerRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/jobApplicationRoutes");
// Initialize express
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socketSetup(server);

// Frontend URL
const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

// Configure CORS
app.use(
  cors({
    origin: FRONTEND_URL, // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Adjust based on your needs
    credentials: true, // Allow credentials
  })
);

console.log("using frontendurl:", FRONTEND_URL);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  next();
});

app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For application/x-www-form-urlencoded form-data

// Initialize Passport configuration
passportConfig(passport);

// Debug middleware
app.use((req, res, next) => {
  console.log("Request Header:", req.header); // Log request body to debug
  console.log("Request Body:", req.body); // Log request body to debug
  console.log("Request Query:", req.query); // Log request body to debug
  console.log("Authorization header:", req.headers.authorization);
  next();
});

// Public routes for login + signup
app.use("/auth", authRoutes);

// Authenticated Routes
app.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  usersRoutes
);
app.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postsRoutes
);
app.use(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  commentsRoutes
);
app.use(
  "/realms",
  passport.authenticate("jwt", { session: false }),
  realmsRoutes
);
app.use(
  "/images",
  passport.authenticate("jwt", { session: false }),
  imagesRoutes
);
app.use(
  "/notifications",
  passport.authenticate("jwt", { session: false }),
  notificationRoutes
);
app.use(
  "/search",
  passport.authenticate("jwt", { session: false }),
  searchRoutes
);
app.use("/jobs", jobsRouter);
app.get("/users/:authorId", async (req, res) => {
  console.log("Requested authorId:", req.params.authorId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.authorId }, // Use UUID as a string
      select: { name: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/users/:userId", async (req, res) => {
  console.log("Requested userId:", req.params.userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//show applied jobs
app.get("/applied-jobs", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Fetch job IDs where the user has applied
    const appliedJobs = await JobApplication.find({ userId }).distinct("jobId");

    res.json({ appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console

  // Determine the status code
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Send JSON response with error details
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
app.get("/jobApplied", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username)
      return res.status(400).json({ error: "Username is required" });

    // Find userId from username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch applied job IDs
    const appliedJobs = await prisma.jobApplication.findMany({
      where: { applicantId: user.id },
      select: { jobId: true },
    });

    res.json({ appliedJobs: appliedJobs.map((app) => app.jobId) });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/employers", employerRoutes); // Use the new route
app.use("/apply", applicationRoutes);
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("App listening on port ", port);
});
