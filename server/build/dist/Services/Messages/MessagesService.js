"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./../../db/db");
var db = new db_1.default().getConnection();
var query;
// testing script
// addMessage({sender_id:1,
//                 receiver_id:2,
//                 type:'user',
//                 content:'מה נשמע?',
//                 time: '8:00:00'});
// getMessagesHistory(1,2,'user');
function getMessagesHistory(sender_id, receiver_id, type) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'messages', { field: 'sender_id', value: sender_id }, { field: 'receiver_id', value: receiver_id }, { field: 'type', value: type });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
exports.getMessagesHistory = getMessagesHistory;
function addMessage(msg) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.insert('messages', msg.sender_id, msg.receiver_id, msg.type, msg.content, msg.time);
        console.log(query);
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.insertId);
        });
    });
}
exports.addMessage = addMessage;
//# sourceMappingURL=MessagesService.js.map