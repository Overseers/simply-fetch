# @overseers/simply-fetch
A [node-fetch](https://www.npmjs.com/package/node-fetch) wrapper to simplify the interface, the output, and bring back some of the comforts of request.
`npm i @overseers/simply-fetch`
---
# Usage
```
const { fetch } = require('@overseers/simply-fetch');
fetch({ url: 'https://sv443.net/jokeapi/v2/joke/Any' }).then((response) => {
    console.log('RESPONSE: ', response);
}).catch((err) => {
    console.log('ERROR: ', err);
});
```
---
# Input
Request Object:
 - `url`: (required) route to the requested resource
 - `method`: (optional) method to utilize for request
   - Default: 'GET'
 - `headers`: (optional) headers to be utilized in the request
 - `qs`: (optional) an object representing the query string
   - example of use:
     ```
     fetch({ url: 'https://someurl/here?key=value&key1=value1' });
     // VS
     fetch({ url: 'https://someurl/here', qs: { key: value, key1: value1 });
     ```
   - example of use with an array of a key:
     ```
     fetch({ url: 'https://someurl/here?key=value&key=value1&key1=value2' });
     // VS
     fetch({ url: 'https://someurl/here', qs: { key: [value, value1], key1: value2 });
     ```
  - `body`: (optional) a payload to be sent as the body of a request
  - `formData`: (optional) can be used for file-uploads and other multi-part requests
    - [form-data](https://www.npmjs.com/package/form-data) is utilized to accommodate for this functionality
  - `agent`: (optional) an object to be passed to Node to be utilized during the request, details can be found [here](https://nodejs.org/dist/latest-v12.x/docs/api/https.html#https_class_https_agent)
    - example:
      ```
      const https = require('https');
      const agent = new https.Agent({ rejectUnauthorized: false });
      fetch({ url: 'https://someurl/here', agent });
      ```
---
# Output
Response Object:
  - `status`: the status number sent back from the request
  - `headers`: the headers from the response
  - `body`: the response being sent back
