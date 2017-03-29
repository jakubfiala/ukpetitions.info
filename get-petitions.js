const fs = require('fs');
const http = require('http');

const totalPetitions = 8489;

let Petitions = [];

const getMorePetitions = (petitions, curPage, increment) => {
	console.log('page', curPage, petitions.length);

	const options = {
	  host: 'lda.data.parliament.uk',
	  path: `/epetitions.json?_pageSize=${increment}&_page=${curPage}`
	};

	const callback = response => {
	  let str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', chunk => str += chunk);

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', () => {
	  	const res = JSON.parse(str);
	  	petitions.push(...res.result.items);
	  	if (curPage * increment < totalPetitions - increment) getMorePetitions(petitions, curPage + 1, increment);
	  	else {
	  		fs.writeFile('petitions.json', JSON.stringify(petitions), err => console.log(err ? 'Error writing file' : 'Done.'));
	  	}
	  });
	}

	http.request(options, callback).end();
}

getMorePetitions(Petitions, 0, 500);