const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "layouts/admin";
const adminDescription = "A blog template made with NodeJS and ExpressJs";

const renderAuthPage = (
    res,
    {
        title,
        registeredSuccess = false,
        message,
        statusCode = 200,
    }
) => {
    const locals = {
        title,
        description: adminDescription,
    };

    return res.status(statusCode).render("admin/index", {
        locals,
        layout: adminLayout,
        registeredSuccess,
        message,
    });
};

/**
 * Get /
 * Admin - Check Login
 */

router.get("/admin", async (req, res) => {
    try {
        return renderAuthPage(res, {
            title: "Admin",
            registeredSuccess: req.query.registered === "1",
        });
    }
        catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
});

/**
 * Get /register
 * Admin - Register Page
 */
router.get("/register", async (req, res) => {
    try {
        return renderAuthPage(res, {
            title: "Register",
            registeredSuccess: req.query.registered === "1",
        });
    }
        catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
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
        if (!decoded || !decoded.userId) {
            res.clearCookie("token", { path: "/" });
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.clearCookie("token", { path: "/" });
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
            return renderAuthPage(res, {
                title: "Admin",
                message: "Please provide username and password",
                statusCode: 400,
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return renderAuthPage(res, {
                title: "Admin",
                message: "Invalid username or password",
                statusCode: 401,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return renderAuthPage(res, {
                title: "Admin",
                message: "Invalid username or password",
                statusCode: 401,
            });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie("token", token, { httpOnly: true, path: "/" });

        return res.redirect("/dashboard");
    }
        catch (error) {
            console.error(error);
            return renderAuthPage(res, {
                title: "Admin",
                message: "Something went wrong. Please try again.",
                statusCode: 500,
            });
        }
});

/**
 * GET /dashboard
 * Admin - Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Dashboard",
            description: "A blog template made with NodeJS and ExpressJS",
        };

        const data = await Post.find({ user: req.userId }).sort({ createdAt: -1 });

        return res.render("admin/dashboard", { locals, data, layout: adminLayout });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
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
            return renderAuthPage(res, {
                title: "Register",
                message: "Please provide username and password",
                statusCode: 400,
            });
        }

        let user = await User.findOne({ username });

        if (user) {
            return renderAuthPage(res, {
                title: "Register",
                message: "User already exists",
                statusCode: 400,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            username,
            password: hashedPassword,
        });

        return res.redirect("/register?registered=1");
    }
        catch (error) {
            console.error(error);

            if (error && error.code === 11000) {
                return renderAuthPage(res, {
                    title: "Register",
                    message: "User already exists",
                    statusCode: 400,
                });
            }

            return renderAuthPage(res, {
                title: "Register",
                message: "Something went wrong with registration.",
                statusCode: 500,
            });
        }
});

/**
 * GET /logout
 * Admin - Logout
 */
router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("token", { path: "/" });
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});


/**
 * GET /add-post
 * Admin - Add Post Page
 */
router.get("/add-post", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Create Post",
            description: "A blog template made with NodeJS and ExpressJS, and EJS",
        };

    const data = await Post.find();
    res.render("admin/add-post", { locals, data, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});


/**
 * POST /add-post
 * Admin - Add Post
 */
router.post("/add-post/", authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        
      try{
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
            user: req.userId,
        });
      await Post.create(newPost);
      res.redirect("/dashboard");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
        console.log(error);
    } 
});
     

/**
 * GET /edit-post
 * Admin - Edit Post Page
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        const locals ={
            title: "Edit Post",
            description: "A blog template made with NodeJS and ExpressJS, and EJS",
        };

        const data =  await Post.findOne ({ _id: req.params.id});
        res.render("admin/edit-post", {locals, data, layout:adminLayout});
     } catch (error) {
        console.log(error);
    }
});
    

/**
 * PUT /edit-post
 * Admin - Edit Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
    try{
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now(),
        });
        res.redirect("/dashboard");
     } catch (error){
        console.log(error);
     }
    });


/**
 * DELETE /delete-post
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect("/dashboard");
     } catch (error){
        console.log(error);
     }
    });


module.exports = router; 
  