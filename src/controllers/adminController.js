const prisma = require("../lib/prisma");

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED" ];

async function updateIssueStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!status) {
            return res.status(400).json({ message: "status is required" });
        }
        
        if(!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ 
                message: "Invalid status",
            validStatuses: VALID_STATUSES,
            });
        }

        const issue = await prisma.issue.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: { id: true, name: true, email:true },
                },
            },
        });

        res.status(200).json({ issue });
    } catch (error) {
        if(error.code === "P2025") {
            return res.status(404).json({ message: "Issue not found" });
        }
        console.error(error);
        res.status(500).json({ message: "Failed to update status" });
    }
}


async function disableUser(req, res) {
    try {
        const { id } = req.params;

        const user = await prisma.user.update({
            where: { id },
            data: { isDisabled: true },
            select: { id: true, name: true, email: true, role: true, isDisabled: true},
        });

        res.status(200).json({ user });
    } catch (error) {
        if(error.code == "P2025") {
            return res.status(404).json({ message: "User not found"});
        }
        console.error(error);
        res.status(500).json({ message: "FAiled to disbale user"});
    }
}

async function deleteIssue(req, res) {
    try {
        const { id } = req.params;

        await prisma.issue.delete({
            where: { id },
        });

        res.status(200).json({ message: "Issue deleted successfully "});
    } catch(error) {
        if(error.code === "P2025") {
            return res.status(404).json({ message: "Issue not found" });
        }
        console.error(error);
        res.status(500).json({ message: "Failed to delete issue" });
    }
}

module.exports = {
    updateIssueStatus,
    disableUser,
    deleteIssue
};