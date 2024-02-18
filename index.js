const axios = require("axios");
const fs = require("fs");
const { codToArray } = require("./modules/file-management");

// Function to sanitize card name for the query
function sanitizeCardName(cardName) {
    return cardName.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}

// Function to query Scryfall API for card details and save image
async function fetchAndSaveCardImage(cardName) {
    try {
        const sanitizedCardName = sanitizeCardName(cardName);
        const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${sanitizedCardName}&language=pt`);

        const { set, collector_number } = response.data;

        console.log(set, collector_number);

        const imageResponse = await axios.get(
            `https://api.scryfall.com/cards/${set}/${collector_number}/pt?format=image`,
            {
                responseType: "stream"
            }
        );

        const imagePath = `./export/${sanitizedCardName}.png`;
        const imageStream = fs.createWriteStream(imagePath);
        imageResponse.data.pipe(imageStream);

        return new Promise((resolve, reject) => {
            imageStream.on("finish", () => resolve(imagePath));
            imageStream.on("error", reject);
        });
    } catch (error) {
        console.error(`Error fetching card "${cardName}":`, error.message);
    }
}

// Function to fetch and save images for all card names
async function fetchAndSaveImages(cardNames) {
    const imagePaths = [];
    for (const cardName of cardNames) {
        const imagePath = await fetchAndSaveCardImage(cardName);
        if (imagePath) {
            imagePaths.push(imagePath);
        }
    }
    return imagePaths;
}

// Main function to execute the script
async function main() {
    const cardNames = await codToArray(`Arcades-Walls_v1.4.0.cod`);
    const imagePaths = await fetchAndSaveImages(cardNames);
    console.log("Images saved:", imagePaths);
}

main();
