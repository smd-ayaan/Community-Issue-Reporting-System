///const prisma = require("./lib/prisma");
const { apiLimiter } = require("./middleware/rateLimiter");
const express = require('express');
const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoute");
const adminRoutes = require("./routes/adminRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(express.json());
app.use(apiLimiter);

if(process.env.NODE_ENV !== "production") {
    app.set("json space", 2);
}

app.get("/health", (req,res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes)
app.use("/issues", issueRoutes);
app.use("/", commentRoutes);

module.exports = app;