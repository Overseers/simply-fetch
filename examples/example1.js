const { fetch } = require('../dist');

fetch({ url: 'https://sv443.net/jokeapi/v2/joke/Any' }).then((response) => {
    console.log('RESPONSE: ', response);
}).catch((err) => {
    console.log('ERROR: ', err);
});
