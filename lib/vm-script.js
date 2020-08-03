const vm = require('vm');
const path = require('path');
const fs = require('fs');

/**
 * @typedef {(...args: any[]) => any} Callback
 */

/**
 * @param { Callback } callback
 */
function testQuery(callback) {
    return setTimeout(() => callback(100500), 2000);
}

/**
 * @param {string} path
 * @param { Callback } callback
 */
function init(filePath, callback) {
    filePath = path.resolve(init.caller.arguments[4], filePath);
    let code = fs.readFileSync(filePath, 'utf8');
    let filename = path.parse(filePath).name + path.parse(filePath).ext;
    const script = new vm.Script(
        `(async () => {${code
            .replace(/testQuery/g, 'await testQuery')
            .replace(/await await/g, 'await')}})();`,
        {
            filename,
        }
    );

    function testResult(result) {
        callback(result);
    }

    const ctx = vm.createContext({
        testQuery: (callback) =>
            typeof callback === 'function'
                ? testQuery(callback)
                : new Promise((resolve) => testQuery(resolve)),
        testResult
    });

    script.runInNewContext(ctx);
}

module.exports = init;
