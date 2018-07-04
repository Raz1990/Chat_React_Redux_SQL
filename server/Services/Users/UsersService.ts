import DB from "./../../db/db";

const db = new DB().getConnection();

let query;

export function addUser(user) {
    return new Promise((resolve, reject) => {
        query = DB.insert('users',user.user_name,user.password,user.age);
        db.query(query, (err, results)=> {
            if (err){
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

//addUser({user_name:'Baz', password:'rrr', age:27});

export function getUserById(id: number) {
    return new Promise((resolve, reject) => {
        query = DB.select('*','users',{field:'id', value:id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}

//getUserById(1);

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
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}

//getUserByNameXORPassword({user_name:'Raz', password:'rrr'});
//getUserByNameXORPassword({user_name:'Raz'});

export function getAllUsers() {
    return new Promise((resolve, reject) => {
        query = DB.select('*','users');
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

//getAllUsers();

export function deleteUser(user) {
    return new Promise((resolve, reject) => {
        query = DB.delete('users',{field:'id', value:user.id});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

//deleteUser({id:4});

export function updateUser(user) {
    return new Promise((resolve, reject) => {
        query = DB.update('users',{field:'id', value:user.id},{field:'password', value:user.password}, {field:'age', value:user.age});
        db.query(query, (err, results)=>{
            if (err){
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}

//updateUser({id:1, password:'ggg', age:30});






