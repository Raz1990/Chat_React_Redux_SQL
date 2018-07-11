import DB from "./../../db/db";

const db = new DB().getConnection();

let query;

// testing script

// addMessage({sender_id:1,
//                 receiver_id:2,
//                 type:'user',
//                 content:'מה נשמע?',
//                 time: '8:00:00'});
// getMessagesHistory(1,2,'user');

export function getMessagesHistory(sender_id,receiver_id,type) {
    return new Promise((resolve, reject) => {
        query = DB.select('*','messages',
            {field:'sender_id',value:sender_id},
            {field:'receiver_id',value:receiver_id},
            {field:'type',value:type});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

export function addMessage(msg) {
    return new Promise((resolve, reject) => {
        query = DB.insert('messages',msg.sender_id,msg.receiver_id,msg.type,msg.content,msg.time);
        console.log(query);
        db.query(query, (err, results)=> {
            if (err){
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.insertId);
        });
    });
}