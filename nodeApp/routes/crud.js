const express = require("express");
const router = express.Router();
const {isAuthenticated} = require("./auth"); //Import our Authentcation routes

router.get("/addgame", isAuthenticated, (req,res)=>{
    res.render("addgame", {
        title:"Add a game to the Favorite Game Database",
        message:"Please add a game."
    })
});

module.exports = router;