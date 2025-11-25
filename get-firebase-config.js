const fs = require('fs');
const serviceAccount = require('./serviceAccountKey.json');
const config = JSON.stringify(serviceAccount);
console.log(config);
