const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
    listComments,
    createComment,
    deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.get("/issues/:issueId/comments", authenticate, listComments);
router.post("/issues/:issueId/comments", authenticate, createComment);
router.delete("/comments/:id", authenticate, deleteComment);

module.exports = router;