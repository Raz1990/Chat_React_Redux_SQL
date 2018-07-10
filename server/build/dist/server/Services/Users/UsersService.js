"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./../../db/db");
var db = new db_1.default().getConnection();
var query;
// testing script
// addUser({user_name:'Raz', password:'ggg', age:30});
// updateUser({id:1, password:'rrr', age:27});
// getUserById(1);
// getUserByNameXORPassword({user_name:'Raz', password:'rrr'});
// getUserByNameXORPassword({user_name:'Raz'});
// addUser({user_name:'Moshe', password:'moses', age:28});
// addUser({user_name:'Temp', password:'t', age:69});
// getAllUsers();
// deleteUser({id:3});
function addUser(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.insert('users', user.user_name, user.password, user.age);
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log('in addUser');
            console.log(results);
            resolve(results.insertId);
        });
    });
}
exports.addUser = addUser;
function getUserById(id) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'users', { field: 'id', value: id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in getUserById');
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}
exports.getUserById = getUserById;
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
            console.log('in getUserByNameXORPassword');
            console.log(results[0]);
            resolve(results[0]);
        });
    });
}
exports.getUserByNameXORPassword = getUserByNameXORPassword;
function getAllUsers() {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'users');
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in getAllUsers');
            console.log(results);
            resolve(results);
        });
    });
}
exports.getAllUsers = getAllUsers;
function getAllUsersInGroups() {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'users_in_group');
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
exports.getAllUsersInGroups = getAllUsersInGroups;
function deleteUser(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.delete('users', { field: 'id', value: user.id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log('in deleteUser');
            console.log(results);
            resolve(results);
        });
    });
}
exports.deleteUser = deleteUser;
function updateUser(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.update('users', { field: 'id', value: user.id }, { field: 'password', value: user.password }, { field: 'age', value: user.age });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log('in updateUser');
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.updateUser = updateUser;
//# sourceMappingURL=UsersService.js.map