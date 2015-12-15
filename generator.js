var client = require('redis').createClient();
var async = require('async');

function generator (callback) {
    async.waterfall([
        function(cb){
            client.rpush('queue', getMessage(), cb)
        },
        function(answer,cb){
            setTimeout(function(){generator(cb);},
                Math.floor(Math.random()*10000));
        }
    ],function(err){
        console.log('end',err)
    });
}
function getMessage(){
    return JSON.stringify({value: Math.floor(Math.random()*100).toString(),
    lastTryAt: 0,
    tryes: 0});
}
exports.generate = function () {
  generator();
};

//console.log(getQueueNumber())
generator();