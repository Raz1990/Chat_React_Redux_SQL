"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./../../db/db");
var db = new db_1.default().getConnection();
var query;
function addUser(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.insert('users', user.user_name, user.password, user.age);
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.addUser = addUser;
//addUser({user_name:'Baz', password:'rrr', age:27});
function getUserById(id) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'users', { field: 'id', value: id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}
exports.getUserById = getUserById;
//getUserById(1);
function getUserByNameXORPassword(user) {
    return new Promise(function (resolve, reject) {
        if (user.password) {
            query = db_1.default.select('*', 'users', { field: 'user_name', value: user.user_name }, { field: 'password', value: user.password });
        }
        else {
            query = db_1.default.select('*', 'users', { field: 'user_name', value: user.user_name });
        }
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}
exports.getUserByNameXORPassword = getUserByNameXORPassword;
//getUserByNameXORPassword({user_name:'Raz', password:'rrr'});
//getUserByNameXORPassword({user_name:'Raz'});
function getAllUsers() {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'users');
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
exports.getAllUsers = getAllUsers;
//getAllUsers();
function deleteUser(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.delete('users', { field: 'id', value: user.id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
exports.deleteUser = deleteUser;
deleteUser({ id: 4 });
function updateUser(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.update('users', { field: 'id', value: user.id }, { field: 'password', value: user.password }, { field: 'age', value: user.age });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.updateUser = updateUser;
//updateUser({id:1, password:'ggg', age:30});
//# sourceMappingURL=UsersService.js.map