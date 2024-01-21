const fs = require('fs');
const sizeOf = require("image-size");

module.exports.createAtrwork = () => {
    const artworkPics = fs.readdirSync('public/images/drawings/thumbnails');
    let embeddedArtwork = "";

    for (let i = 0; i < artworkPics.length; i++) {
        const artwork = artworkPics[i];

        const dimensions = sizeOf(`public/images/drawings/thumbnails/${artwork}`);
        const width = dimensions.width;
        const height = dimensions.height;
        const flexGrow = (((3 / height) * width) / 4) * 10;
        const initialWidth = ((240 / height) * width);
        const maxWidth = initialWidth * 3;
        // const maxWidth = (i > (artworkPics.length - 4)) ? (initialWidth * 2) : (initialWidth * 3);

        embeddedArtwork += `
        <div id="${artwork.slice(0, -4)}" style="aspect-ratio:${width}/${height};flex-grow:${flexGrow};width:${initialWidth}px;max-width:${maxWidth}px;">
            <a href="/image-viewer/drawings/${artwork}">
                <img src="images/drawings/thumbnails/${artwork}">
            </a>
        </div>`
    }

    return embeddedArtwork;
}