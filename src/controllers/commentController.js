const prisma = require("../lib/prisma");

async function listComments(req, res) {
    try {
        const { issueId } = req.params;

        const issue = await prisma.issue.findUnique({ where: { id: issueId } });

        if(!issue) {
            return res.status(404).json({ message: "Issue not found " });
        }

        const comments = await prisma.comment.findMany({
            where: { issueId },
            orderBy: { createdAt: "asc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        res.status(200).json({ comments, count: comments.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
}

async function createComment(req, res) {
    try {
        const { issueId } = req.params;
        const { content } = req.body;
   
        if (!content || !content.trim()) {
            return res.status(400).json({ message: "content is required" });
        }
   
        const issue = await prisma.issue.findUnique({ where: { id: issueId } });
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }
   
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                issueId,
                userId: req.user.userId,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
   
        res.status(201).json({ comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create comment" });
    }
}

async function deleteComment(req, res) {
    try {
        const { id } = req.params;
   
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
   
        if (comment.userId !== req.user.userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }
   
        await prisma.comment.delete({ where: { id } });
   
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete comment" });
    }
}
 
module.exports = {
    listComments,
    createComment,
    deleteComment,
};