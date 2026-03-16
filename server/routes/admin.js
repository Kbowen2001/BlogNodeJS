const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

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
        });
    }
        catch (error) {
            console.error(error);
        }
});



module.exports = router;
