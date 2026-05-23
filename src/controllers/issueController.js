const prisma = require("../lib/prisma");
const cloudinary = require("../lib/cloudinary");

const VALID_CATEGORIES = [
    "POTHOLE",
    "GARBAGE",
    "WATER_LEAK",
    "TRAFFIC",
    "SAFETY",
    "STREET_LIGHT",
    "OTHER",
];
/*
async function listIssues(req, res) {
    try {
        const issues = await prisma.issue.findMany({
            orderBy: { createdAt: "desc" },
            include : {
                user : {
                    select: {id: true, name: true, email: true },
                },
            },
        });
        res.status(200).json({ issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ messgae: "Failed to fetch issues" });
    }
}*/

async function listIssues(req, res) {
    try {
        const { category, status, location, userId } = req.query;
 
        const where = {};
 
        if (category) {
            if (!VALID_CATEGORIES.includes(category)) {
                return res.status(400).json({
                    message: "Invalid category",
                    validCategories: VALID_CATEGORIES,
                });
            }
            where.category = category;
        }
 
        if (status) {
            const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"];
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status",
                    validStatuses: VALID_STATUSES,
                });
            }
            where.status = status;
        }
 
        if (location) {
            where.location = {
                contains: location,
                mode: "insensitive",
            };
        }
 
        if (userId) {
            where.userId = userId;
        }
 
        const issues = await prisma.issue.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
 
        res.status(200).json({ issues, count: issues.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch issues" });
    }
}

async function createIssue(req, res) {
    try {
        const{ title, description, category, location } = req.body;

        if(!title || !description || !category || !location ) {
            return res.status(400).json({
                message: "title, description, category, location and userId are required",
            });
        }

        if(!VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                message: "Invalid category",
                validCategories: VALID_CATEGORIES,
            });
        }

        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if(!user) {
            return res.status(400).json({ message: "User not found"});
        }
        if(user.isDisabled) {
            return res.status(400).json({message: "User account is disable. Please contact admin" });
        }

        let imageUrl = null;

        if(req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "community-issues",
                resource_type: "auto",
            });

            imageUrl = result.secure_url;
        }

        const issue = await prisma.issue.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                category,
                imageUrl,
                location: location .trim(),
                userId: req.user.userId,
            },
            include :{
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        res.status(201).json({ issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ messgae: "Failed to creat issue "});
    }
}

async function getIssueId(req, res) {
    try {
        const { id } = req.params;

        const issue = await prisma.issue.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if(!issue) {
            return res.status(404).json({message: "Issue not found" });
        }

        res.status(200).json({ issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch issue "})
    }
}

async function updateIssue(req, res) {
    try {
        const{ id } = req.params;
        const{ title, description, category, location } = req.body;

//        if(!userId) {
//            return res.status(400).json({ message: "userId is required" });
//        }

        const existing = await prisma.issue.findUnique({ where: { id }});
        if(!existing) {
            return res.status(404).json({ message: "Issue not found" });
        }

        if(existing.userId !== req.user.userId) {
            return res.status(403).json({ message: "You can only edit your own issues"});
        }

        if (category && !VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                message: "Invalid category",
                validCategories: VALID_CATEGORIES,
            });
        }

        let imageUrl = existing.imageUrl;

        if(req.file) {
            if(existing.imageUrl) {
                const publicId = existing.imageUrl.split("/").slice(-2).join("/").split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "community-issues",
                resource_type: "auto",
            });

            imageUrl = result.secure_url; 

        }

        const issue = await prisma.issue.update({
            where: { id },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && { description: description.trim() }),
                ...(category !== undefined && { category }),
                ...(req.file && { imageUrl }),
                ...(location !== undefined && { location: location.trim() }),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true},
                },
            },
        });

        res.status(200).json({ issue });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update issue" });
    }
}

module.exports = {
    listIssues,
    createIssue,
    getIssueId,
    updateIssue
};