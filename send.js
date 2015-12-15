var request = require('request');


exports.send = function (val, callback) {
    return request({
        method: 'GET',
        uri: 'http://localhost:1337/lol/?params=' + val
    }, function (err, response) {
         callback(err, response.body);
    });
};
