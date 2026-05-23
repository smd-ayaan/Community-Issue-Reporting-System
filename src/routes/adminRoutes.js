const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { requiredAdmin } = require("../middleware/adminMiddleware");
 
const {
    updateIssueStatus,
    disableUser,
    deleteIssue,
} = require("../controllers/adminController");
//const { updateIssue } = require("../controllers/issueController");
//const { deleteIssue } = require("../controllers/admincontroller");
const router = express.Router();

router.patch("/issues/:id/status", authenticate, requiredAdmin, updateIssueStatus);
router.patch("/users/:id/disable", authenticate, requiredAdmin, disableUser);
router.delete("/issues/:id", authenticate, requiredAdmin, deleteIssue);

module.exports = router;