const express = require("express");
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = process.env.NODE_ENV === "production" ? ['https://tech-forge-seven.vercel.app/'] : ['http://localhost:3000']

const app = express();
const port = process.env.PORT || 5000;


connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if(req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

// Routes
app.use("/", userRoutes);
app.use("/projects", projectRoutes);
app.use("/notifications", notificationRoutes);


// Health Check
app.get("/health", (req,res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error Handler
app.use((error, req, res, next) => {
    console.error("Global error handler:", error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
