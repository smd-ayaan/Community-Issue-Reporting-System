const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function signup(req, res) {
    try {
        const{ name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: "name, email and password are required" });
        }

        const existing = await prisma.user.findUnique({ where: {email}});
        if(existing) {
            return res.status(409).json({ message: "Email already existing" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({ 
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                passwordHash,
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        const token = jwt.sign(
            { userId: user.id, role : user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed" });
    }
}

async function signupAdmin(req, res) {
    try{
        const{ name, email, password, masterkey } = req.body;

        if(!name || !email || !password || !masterkey) {
            return res.status(400).json({ message: "name, email, password and masterkey required" });
        }

        if(masterkey !== process.env.ADMIN_MASTER_KEY){
            return res.status(403).json({ message: "Invalid master key"});
        }

        const existing = await prisma.user.findUnique({ where: { email }});
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                passwordHash,
                role: "ADMIN",
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Admin signup failed" });
    }
}

async function login(req, res) {
    try {
        const { email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "email and password required" });
        }

        const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
        if(!user) {
            return res.status(401).json({ message: "invalid Credentials" });
        }

        if(user.isDisabled) {
            return res.status(403).json({ message: "Account is disabled "});
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid) {
            return res.status(401).json({ message: "invalid Credentials" });
        } 

        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d" }
        );

        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
}

module.exports = { signup, signupAdmin, login };