import DB from "./../../db/db";

const db = new DB().getConnection();

let query;

// testing script

// addGroup('Friends');
// addGroup('Best Friends');
// addGroup('Temp');
// addUserToGroup({host_id:2,user_id:1});
// addUserToGroup({host_id:2,user_id:2});
// removeUserFromGroup({host_id:1,user_id:1});
// addUserToGroup({host_id:2,user_id:1});
// getAllGroups();
// moveGroups({host_id:1,moving_id:2});
// getAllGroups();
// deleteGroup({id:2},true);
// getAllGroups();
// getAllGroupMembers(1);
// getAllGroupMembers(2);

export function addGroup(group_name, parent_id?) {
    parent_id = parent_id || null;

    return new Promise((resolve, reject) => {
        query = DB.insert('groups', group_name, parent_id);
        db.query(query, (err, results) => {
            if (err) {
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

export function addUserToGroup(addingObject) {
    return new Promise((resolve, reject) => {
        query = DB.insert('users_in_group',addingObject.host,addingObject.user);
        db.query(query, (err, results)=> {
            if (err){
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

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

export function getGroupMembers(group_id) {
    return new Promise((resolve, reject) => {
        query = DB.select('user_id','users_in_group', {field:'host_id', value:group_id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            if (results.length>0) {
                console.log(results);
                query = `SELECT * FROM users WHERE id IN (${results.map(u => u.user_id)})`;
                db.query(query, (err, results)=> {
                    if (err) {
                        console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
                    }
                    console.log(results);
                    resolve(results);
                });
            }
            else {
                query = DB.select('*','groups', {field:'parent_id', value:group_id});
                db.query(query, (err, results)=>{
                    if (err){
                        console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
                    }
                    console.log(results);
                    resolve(results);
                });
            }
        });
    });
}

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
        query = DB.update('groups',
            {field:'id', value:group.id},
            {field:'group_name', value:group.group_name});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN UPDATE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

export function removeUserFromGroup(removingObject) {
    return new Promise((resolve, reject) => {
        query = DB.delete('users_in_group',
            {field:'host_id', value:removingObject.group_id},
            {field:'user_id', value:removingObject.user_id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

export function moveGroups(groups) {
    return new Promise((resolve, reject) => {
        query = DB.update('groups',
            {field:'id', value:groups.mover},
            {field:'parent_id', value:groups.host});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN UPDATE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

export async function deleteGroup(group, flatten?) {
    if (flatten) {
        const new_host_id = await getGroupParent(group.id);
        await moveUsersToAnotherGroup(group, new_host_id);
    }
    else {
        await deleteUsersFromAGroup(group);
    }
    return new Promise((resolve, reject) => {
        query = DB.delete('groups',{field:'id', value:group.id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

function getGroupParent(group_id) {
    //find the parent group id
    query = DB.select('parent_id', 'groups', {field: 'id', value: group_id});
    db.query(query, async (err, results) => {
        if (err) {
            console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
        }
        const new_host_id = results[0].parent_id;
        console.log(new_host_id);
        return new_host_id;
    });
}

function moveUsersToAnotherGroup(group, new_host_id) {
    //find the group users
    query = DB.select('user_id', 'users_in_group', {field: 'host_id', value: group.id});
    db.query(query, async (err, results) => {
        if (err) {
            console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
        }
        const user_members = results;
        console.log(user_members);

        //update the members to the new group
        for (const user of user_members) {
            query = DB.update('users_in_group',
                {field: 'host_id', value: group.id},
                {field: 'host_id', value: new_host_id},
                {field: 'user_id', value: user.user_id});
            db.query(query, (err, results) => {
                if (err) {
                    console.error("ERROR IN UPDATE QUERY>>>>>>>>>", err);
                }
                console.log(results);
                return results;
            });
        }
    });
}

function deleteUsersFromAGroup(group) {
    //delete the members from the old group
    query = DB.delete('users_in_group',{field:'host_id', value:group.id});
    db.query(query, async (err, results)=>{
        if (err){
            console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
        }
        console.log(results);
        return results;
    });
}