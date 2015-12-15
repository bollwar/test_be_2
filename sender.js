var client = require('redis').createClient();
var async = require('async');
var sendUtil = require('./send');
var moment = require('moment');

function sender (callback) {
    var rObj ={};
    async.waterfall([
            function(cb){
                client.blpop('queue', 100, cb)
            },
            function(answer, cb){
                cb(null,JSON.parse(answer[1]))
            },
            function(answer, cb){
                check(answer,cb);
            },
            function(answer, cb){
                rObj = answer[1];
                if (answer[0]) {
                    sendUtil.send(answer[1].value, cb);
                } else {
                    cb(null,'false');
                }
            }
        ],
        function(error, res){
           if (error) {
               console.log(error+'here');
           } else {
               if (JSON.parse(res)) {
                   console.log('Pased',rObj);
                   client.rpush('queueReady', JSON.stringify(rObj));
               } else {
                   if (rObj.tryes < 4) {
                       console.log('next',rObj);
                       client.rpush('queue', JSON.stringify(rObj));
                   } else {
                       console.log('-1',rObj);
                   }
               }
           }
            sender(callback);

        });
};

function check (obj,callback) {
    var MIN = 59997;
    var timeNow = moment().format('x');
    var answ;
    switch (obj.tryes + '') {
        case '0':
            obj.tryes++;
            obj.lastTryAt = timeNow;
            answ = true;
            break;
        case '1':
            if (timeNow - obj.lastTryAt > MIN) {
                obj.lastTryAt = timeNow;
                obj.tryes++;
                answ = true;
            } else {
                answ = false;
            }
            break;
        case '2':
            if (timeNow - obj.lastTryAt > 3 * MIN) {
                obj.lastTryAt = timeNow;
                obj.tryes++;
                answ = true;
            } else {
                answ = false;
            }
            break;
        case '3':
            if (timeNow - obj.lastTryAt > 5 * MIN) {
                obj.lastTryAt = timeNow;
                obj.tryes++;
                answ = true;
            } else {
                answ = false;
            }
            break;
        default:
            answ = null;
    };
    callback(null,[answ, obj]);
}
exports.sender = function() {
    sender();
};
 sender();