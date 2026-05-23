const express = require("express");
const { authenticate } = require("../middleware/authMiddleware"); 
const upload = require("../middleware/upload");
const { createIssueLimiter } = require("../middleware/rateLimiter");

const {
    listIssues,
    createIssue,
    getIssueId,
    updateIssue,
} = require("../controllers/issueController");

const router = express.Router();

router.get("/",authenticate, listIssues);
//router.post("/",authenticate, createIssue);
//router.post("/", authenticate, upload.single("image"), createIssue);
router.post("/", authenticate, createIssueLimiter, upload.single("image"), createIssue);
router.patch("/:id", authenticate, upload.single("image"), updateIssue);
router.get("/:id",authenticate, getIssueId);
//router.patch("/:id",authenticate, updateIssue);


module.exports = router;