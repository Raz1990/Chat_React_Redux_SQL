import DB from "./../../db/db";

const db = new DB().getConnection();

let query;

// testing script

// addUser({user_name:'Raz', password:'ggg', age:30});
// updateUser({id:1, password:'rrr', age:27});
// getUserById(1);
 getUserByNameXORPassword({user_name:'Raz', password:'rrr'});
// getUserByNameXORPassword({user_name:'Raz'});
// addUser({user_name:'Moshe', password:'moses', age:28});
// addUser({user_name:'Temp', password:'t', age:69});
// getAllUsers();
// deleteUser({id:3});

export function addUser(user) {
    return new Promise((resolve, reject) => {
        query = DB.insert('users',user.user_name,user.password,user.age);
        db.query(query, (err, results)=> {
            if (err){
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log('in addUser');
            console.log(results);
            resolve(results.insertId);
        });
    });
}

export function getUserById(id: number) {
    return new Promise((resolve, reject) => {
        query = DB.select('*','users',{field:'id', value:id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in getUserById');
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}

export function getUserByNameXORPassword(user) {
    return new Promise((resolve, reject) => {
        if (user.password) {
            query = DB.select('*','users',{field:'user_name', value:user.user_name}, {field:'password', value:user.password});
        }
        else {
            query = DB.select('*','users',{field:'user_name', value:user.user_name});
        }
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in getUserByNameXORPassword');
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}

export function getAllUsers() {
    return new Promise((resolve, reject) => {
        query = DB.select('*','users');
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in getAllUsers');
            console.log(results);
            resolve(results);
        });
    });
}

export function deleteUser(user) {
    return new Promise((resolve, reject) => {
        query = DB.delete('users',{field:'id', value:user.id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log('in deleteUser');
            console.log(results);
            resolve(results);
        });
    });
}

export function updateUser(user) {
    return new Promise((resolve, reject) => {
        query = DB.update('users',{field:'id', value:user.id},{field:'password', value:user.password}, {field:'age', value:user.age});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in updateUser');
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}






