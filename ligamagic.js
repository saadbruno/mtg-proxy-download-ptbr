
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

const url = 'https://www.ligamagic.com.br/?view=dks/impressao&type=1&id=6402299';

async function downloadImages() {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const exportFolder = path.join(__dirname, 'export_ligamagic');
        if (!fs.existsSync(exportFolder)) {
            fs.mkdirSync(exportFolder);
        }

        $('img').each(async function (index, element) {
            const imageUrl = $(element).attr('src');
            const title = $(element).attr('title');

            if (imageUrl && title) {
                const fileName = `${title.replace(/[^\w\s]/gi, '')}.jpg`;
                const filePath = path.join(exportFolder, fileName);

                const dest = fs.createWriteStream(filePath);
                const imageResponse = await fetch(`https:${imageUrl}`);

                stream.pipeline(imageResponse.body, dest, (err) => {
                    if (err) {
                        console.error(`Error downloading ${fileName}: ${err}`);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

downloadImages();
