const express = require('express');
const bodyParser = require("body-parser");
const contactModule = require(__dirname + "/contact.js");
const layoutModule = require(__dirname + "/layout.js");
const fs = require('fs');
const { StringStream } = require("scramjet");
const request = require("request");

const app = express();
const port = 3000;

let parcel;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
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
        currentImage: req.params.image,
        currentFolder: req.params.folder,
        imageListString: fs.readdirSync(`public/images/${req.params.folder}/thumbnails`)
    });
})
app.get("/apps/flashcards", (req, res) => { res.render("flashcards-main"); })
app.get("/apps/flashcards/:category", (req, res) => {
    res.render("flashcards-quiz", { urlParam: req.params.category });
})
app.get("/apps/stocks", (req, res) => { res.render("stocks"); })



// T9HTJL0BTNMVDTYM
// HRO4EJEK4QDRJOEX
// 9FD4FH168YWS1BVJ


app.get("/options", (req, res) => {
    let listOfCompanies = [];
    request.get(`https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=9FD4FH168YWS1BVJ`)
        .pipe(new StringStream())
        .CSVParse()
        .consume(object => listOfCompanies.push(object))
        .then(() => res.status(200).json({ options: listOfCompanies }))
        .catch((err) => {
            console.log("Backend err");
            res.send("Error")
        })
})

app.post("/choices", (req, res) => {
    parcel = req.body;
    // Why do I need this code?
    if (!parcel) return res.status(400).send({ status: "failed" })
    res.status(200).send({ status: "recieved" })
})

app.get("/information", (req, res) => {
    request.get({
        // Clean up the url
        url: `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${parcel.parcel}&apikey=9FD4FH168YWS1BVJ`,
        json: true,
        headers: { 'User-Agent': 'request' }

    }, (err, response, data) => {
        if (err) {
            console.log('Error location: (B-1). ', err);
            res.send("Error")
        } else if (response.statusCode !== 200) {
            console.log('Error location: (B-2). Status: ', response.statusCode);
            res.send("Error");
        } else {
            res.status(200).json({ information: data });
        }
    });
})


// POST REQUESTS
app.post("/", (req, res) => { contactModule.sendEmail(req, res) });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})