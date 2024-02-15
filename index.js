const axios = require('axios');
const fs = require('fs');

// Example usage
const cardNames = [
  'Azorius Signet',
  'Simic Signet',
  'Panharmonicon',
  'Slagwurm Armor',
  'Shield Sphere',
  'Steel Wall',
  'Wall of Hope',
  'Resolute Watchdog',
  'Perimeter Captain',
  'Saruli Caretaker',
  'Portcullis Vine',
  'Overgrown Battlement',
  'Sakura-Tribe Elder',
  'Fortified Rampart',
  'Angelic Wall',
  'Wall of Glare',
  'Wall of Mist',
  'Wall of Omens',
  'Wall of Tanglecord',
  'Wall of Essence',
  'Wall of Blossoms',
  'Wall of Tears',
  'Wall of Mulch',
  'Wall of Roots',
  'Wall of Junk',
  'Jeskai Barricade',
  'Sylvan Caryatid',
  'Stalwart Shield-Bearers',
  'Suspicious Bookcase',
  'Sunscape Familiar',
  'Murmuring Phantasm',
  'Orator of Ojutai',
  'Vine Trellis',
  'Beastcaller Savant',
  'Tetsuko Umezawa, Fugitive',
  'Wall of Frost',
  'Hover Barrier',
  'Wall of Denial',
  'Wall of Ice',
  'Axebane Guardian',
  'Reclamation Sage',
  'Tree of Redemption',
  'Jungle Barrier',
  'Mnemonic Wall',
  'Wall of Stolen Identity',
  'Charix, the Raging Isle',
  'Guard Gomazoa',
  'Riptide Turtle',
  'Song of Freyalise',
  'Assault Formation',
  'High Alert',
  'Sight of the Scalelords',
  'True Conviction',
  'Wild Pair',
  'Steely Resolve',
  'Tower Defense',
  'Heroic Intervention',
  'Eerie Interlude',
  'Ghostway',
  'Sunpetal Grove',
  'Port Town',
  'Seaside Citadel',
  'Yavimaya Coast',
  'Forest',
  'Glacial Fortress',
  'Island',
  'Temple Garden',
  'Krosan Verge',
  'Bant Panorama',
  'Esper Panorama',
  'Naya Panorama',
  'Grasslands',
  'Plains',
  'Exotic Orchard',
  'Hinterland Harbor',
  'Prairie Stream',
  'Evolving Wilds',
  'Command Tower',
  'Terramorphic Expanse',
  'Canopy Vista',
  'Farseek',
  'Edge of Autumn',
  'Rampant Growth',
  'Return to the Ranks',
  'Slaughter the Strong',
  'Fell the Mighty',
  'Wave of Reckoning',
  'Arcades, the Strategist',
  ];

  
  // Function to sanitize card name for the query
  function sanitizeCardName(cardName) {
      return cardName.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  }
  
  // Function to query Scryfall API for card details and save image
  async function fetchAndSaveCardImage(cardName) {
      try {
          const sanitizedCardName = sanitizeCardName(cardName);
          const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${sanitizedCardName}&language=pt`);
          
          const { set, collector_number } = response.data;
  
        console.log(set, collector_number);

          const imageResponse = await axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}/pt?format=image`, {
              responseType: 'stream'
          });
  
          const imagePath = `./${set}-${collector_number}.png`;
          const imageStream = fs.createWriteStream(imagePath);
          imageResponse.data.pipe(imageStream);
  
          return new Promise((resolve, reject) => {
              imageStream.on('finish', () => resolve(imagePath));
              imageStream.on('error', reject);
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
      const imagePaths = await fetchAndSaveImages(cardNames);
      console.log('Images saved:', imagePaths);
  }
  
  main();
  