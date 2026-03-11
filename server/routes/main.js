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


module.exports = router;