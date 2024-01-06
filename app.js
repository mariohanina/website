const express = require('express');
const bodyParser = require("body-parser");
const contactModule = require(__dirname + "/contact.js");
const layoutModule = require(__dirname + "/layout.js");
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/art-gallery", (req, res) => {
    res.render("art-gallery", { allArtwork: layoutModule.createAtrwork() });
})

app.get("/photo-gallery", (req, res) => {
    // res.render("photo-gallery", { allImages: layoutModule.createPhotos() });
    res.render("photo-gallery", { allImages: fs.readdirSync('public/images/photography/thumbnails') });
})

app.get("/image-viewer/:folder/:image", (req, res) => {
    res.render("image-viewer", {
        imageSource: (`/images/${req.params.folder}/${req.params.image}`),
        closeButtonLink: (`/${(req.params.folder == "drawings") ? "art-gallery" : "photo-gallery"}`)
    });
})

app.get("/apps/flashcards", (req, res) => {
    res.render("flashcards");
})



app.post("/", (req, res) => { contactModule.sendEmail(req, res) });

// app.get("/dictionary", (req, res) => { res.status(200).json({ dictionary: layoutModule.readFlashcardsCategories() }); })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})