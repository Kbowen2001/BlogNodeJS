const express = require('express');
const router = express.Router();
const Post = require("../models/post");

//HOME PAGE
router.get("/", async (req, res) => {
    const locals = {
        title: "NodeJS Blog",
        description: "A blog template applicaton that will be used for your own use."
    }

    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        const data = await Post.find()
            .sort({ createdAt: "desc" })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const nextPage = page < totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        res.render("index", {
            locals,
            data,
            nextPage,
            prevPage,
        });
    } catch (error) {
        console.log(error);
    }
});


//Post by ID 
router.get("/post/:id", async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {    
            title: data.title,
            description: "A blog template applicaton that will be used for your own use."
        };
        res.render("post", {
            data,
            locals,
        });
    } catch (error) {
        console.log(error);
    }
});

//SEARCH ROUTE

router.post("/search", async (req, res) => {
    try {
       const locals = {
        title: "Search",
        description: "A blog template made with NodeJS and ExpressJS",
       };

    let searchTerm = (req.body.searchTerm || "").trim();

    if (!searchTerm) {
        return res.render("search", {
            locals,
            data: [],
        });
    }

    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");

    const data = await Post.find({
        $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        ],
    });

    res.render("search", {
        locals,
        data,
    });
} catch (error) {
    console.log(error);
}
});

module.exports = router;