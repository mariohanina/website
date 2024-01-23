const express = require('express');
const bodyParser = require("body-parser");
const contactModule = require(__dirname + "/contact.js");
const layoutModule = require(__dirname + "/layout.js");
const fs = require('fs');
const { StringStream } = require("scramjet");
const request = require("request");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// GET REQUESTS
app.get("/", (req, res) => { res.render("index"); })
app.get("/art-gallery", (req, res) => {
    res.render("art-gallery", { allArtwork: layoutModule.createAtrwork() });
})
app.get("/photo-gallery", (req, res) => {
    res.render("photo-gallery", { allImages: fs.readdirSync('public/images/photography/thumbnails') });
})
app.get("/image-viewer/:folder/:image", (req, res) => {
    res.render("image-viewer", {
        imageSource: (`/images/${req.params.folder}/${req.params.image}`),
        closeButtonLink: (`/${(req.params.folder == "drawings") ? "art-gallery" : "photo-gallery"}`)
    });
})
app.get("/apps/flashcards", (req, res) => { res.render("flashcards"); })
app.get("/apps/flashcards/:category", (req, res) => {
    res.render("flashcards-quiz", { urlParam: req.params.category });
})
app.get("/apps/stocks", (req, res) => { res.render("stocks"); })



// T9HTJL0BTNMVDTYM
// HRO4EJEK4QDRJOEX


app.get("/options", (req, res) => {
    let listOfCompanies = [];
    request.get(`https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=T9HTJL0BTNMVDTYM`)
        .pipe(new StringStream())
        .CSVParse()
        .consume(object => listOfCompanies.push(object))
        .then(() => res.status(200).json({ options: listOfCompanies }))
})





// POST REQUESTS
app.post("/", (req, res) => { contactModule.sendEmail(req, res) });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})