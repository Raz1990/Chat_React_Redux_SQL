import DB from "./../../db/db";

const db = new DB().getConnection();

let query;

export function addGroup(group_name, parent_id?) {
    parent_id = parent_id || null;
    return new Promise((resolve, reject) => {
        query = DB.insert('groups',group_name,parent_id);
        db.query(query, (err, results)=> {
            if (err){
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

//addGroup('Temp');

export function getAllGroups() {
    return new Promise((resolve, reject) => {
        query = DB.select('*','groups');
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

//getAllGroups();

export async function getGroupById(id: number) {
    return new Promise((resolve, reject) => {
        query = DB.select('*','groups',{field:'id', value:id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}

export function updateGroup(group) {
    return new Promise((resolve, reject) => {
        query = DB.update('groups',{field:'id', value:group.id},{field:'group_name', value:group.group_name});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

export function addUserToGroup(addingObject) {
    return new Promise((resolve, reject) => {
        const result = db.addUserToGroup(addingObject.groupName, addingObject.userName);
        resolve(result);
    });
}

export function removeUserFromGroup(removingObject) {
    return new Promise((resolve, reject) => {
        const result = db.removeUserFromGroup(removingObject.groupName, removingObject.userName);
        resolve(result);
    });
}

export function moveGroups(groups) {
    return new Promise((resolve, reject) => {
        const result = db.moveGroups(groups.host, groups.mover);
        resolve(result);
    });
}

export function deleteGroup(group) {
    return new Promise((resolve, reject) => {
        query = DB.delete('groups',{field:'id', value:group.id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
