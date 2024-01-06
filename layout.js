const fs = require('fs');
const sizeOf = require("image-size");



module.exports.createAtrwork = () => {
    const artworkPics = fs.readdirSync('public/images/drawings/thumbnails');
    let embeddedArtwork = "";

    for (const artwork of artworkPics) {

        const dimensions = sizeOf(`public/images/drawings/thumbnails/${artwork}`);
        const width = dimensions.width;
        const height = dimensions.height;
        const flexGrow = ((3 / height) * width) / 4;
        const initialWidth = ((240 / height) * width);
        const maxWidth = initialWidth * 2;

        embeddedArtwork += `
        <div id="${artwork.slice(0, -4)}" style="aspect-ratio:${width}/${height};flex-grow:${flexGrow};width:${initialWidth}px;max-width:${maxWidth}px;">
            <a href="/image-viewer/drawings/${artwork}">
                <img src="images/drawings/thumbnails/${artwork}">
            </a>
        </div>`
    }

    return embeddedArtwork;
}

// module.exports.createPhotos = () => {
//     const photos = fs.readdirSync('public/images/photography/thumbnails');
//     let embeddedPhotos = "";

//     for (const image of photos) {
//         embeddedPhotos += `<div>
//             <a href="/image-viewer/photography/${image}">
//                 <img src="images/photography/thumbnails/${image}" height="220" width="320">
//             </a>
//         </div>`;
//     }

//     return embeddedPhotos;
// }

// module.exports.createFlashcardsCategories = () => {
//     const FlashcardsCategories = fs.readdirSync('public/flashcards-dictionary');
//     let embeddedFlashcardsCategories = "";

//     for (const category of FlashcardsCategories) {

//         let word = category.replace(".js", "");
//         let displayWord = word.replaceAll("-", " ");
//         displayWord = word.replace(word[0], word[0].toUpperCase());

//         embeddedFlashcardsCategories += `<a href="/apps/flashcards/${word}">
//             <div>
//                 <h3>${displayWord}</h3>
//                 <span id="${word}"></span>
//             </div>
//         </a>`;
//     }

//     return embeddedFlashcardsCategories;
// }

// module.exports.readFlashcardsCategories = () => {
//     const FlashcardsCategories = fs.readdirSync('public/flashcards-dictionary');

//     let listOfDictionaries = "";

//     for (const category of FlashcardsCategories) {
//         listOfDictionaries += `<script src="/flashcards-dictionary/${category}"></script>`;
//     }

//     return listOfDictionaries;
// }