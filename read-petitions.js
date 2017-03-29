const fs = require('fs');

const petitions = JSON.parse(fs.readFileSync('./petitions.json', { encoding: 'utf8' }));

console.log(petitions.length);