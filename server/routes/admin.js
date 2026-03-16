const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "layouts/admin";

/**
 * Get /
 * Admin - Check Login
 */

router.get("/admin", async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "A blog template made with NodeJS and ExpressJs",
        };

        res.render("admin/index", {
            locals,
            layout: adminLayout,
        }, (err, html) => {
            if (err) console.error(err);
            res.send(html);
        });
    }
        catch (error) {
            console.error(error);
        }
});

/**
 * Check Login Middleware
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

/**
 * Post /admin
 * Admin Login Submit
 */
router.post("/admin", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render("admin/index", {
                layout: adminLayout,
                message: "Please provide username and password",
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).render("admin/index", {
                layout: adminLayout,
                message: "Invalid username or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).render("admin/index", {
                layout: adminLayout,
                message: "Invalid username or password",
            });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie("token", token, { httpOnly: true });

        res.redirect("/dashboard");
    }
        catch (error) {
            console.error(error);
        }
});

/**
 * Post /register
 * Admin Register
 */
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render("admin/index", {
                layout: adminLayout,
                message: "Please provide username and password",
            });
        }

        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).render("admin/index", {
                layout: adminLayout,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            username,
            password: hashedPassword,
        });

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie("token", token, { httpOnly: true });

        res.redirect("/dashboard");
    }
        catch (error) {
            console.error(error);
        }
});

module.exports = router;
