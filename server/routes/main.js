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
        const data = await Post.find().sort({ title: "desc" }).limit(10);
        res.render("index", {
            locals,
            data,
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

    let searchTerm = req.body.searchTerm;
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