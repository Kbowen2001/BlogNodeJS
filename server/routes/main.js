const express = require('express');
const router = express.Router();
const Post = require("../models/Post");

//HOME PAGE
router.get("/", async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        };

        const perPage = 3;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);

        const data = await Post.find({})
            .sort({ title: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage);

        // Count is deprecated - please use countDocuments({}) instead
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render("index", {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: page > 1 ? page - 1 : null,
        });
    } catch (error) {
        console.log(error);
    }
});


//Post by ID 
router.get("/post/:id", async (req, res) => {
    try {
        const slug = req.params.id;

        const data = await Post.findById(slug);

        if (!data) {
            return res.redirect("/");
        }

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