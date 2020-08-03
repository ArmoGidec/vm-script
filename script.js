const vm = require('./lib/vm-script.js');

vm('./test.js', result => {
    console.log(result);
});