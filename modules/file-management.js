const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();

async function codToArray(file) {
    console.log(`Running codToArray`);
    return new Promise((resolve, reject) => {
        fs.readFile(`./input/${file}`, "utf-8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                reject(err);
                return;
            }

            parser.parseString(data, (err, result) => {
                if (err) {
                    console.error("Error parsing XML:", err);
                    reject(err);
                    return;
                }

                const cardsArray = [];

                result.cockatrice_deck.zone.forEach((zone) => {
                    zone.card.forEach((card) => {
                        const cardName = card.$.name;
                        const cardNumber = parseInt(card.$.number);
                        for (let i = 0; i < cardNumber; i++) {
                            cardsArray.push(cardName);
                        }
                    });
                });

                resolve(cardsArray);
            });
        });
    });
}
module.exports = { codToArray };
