"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
            if (results.length > 0) {
                resolve(results[0]);
            }
            else {
                resolve(0);
            }
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //first, remove the user from every group it belongs to
                return [4 /*yield*/, removeUserFromGroups(user)];
                case 1:
                    //first, remove the user from every group it belongs to
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            query = db_1.default.delete('users', { field: 'id', value: user.id });
                            db.query(query, function (err, results) {
                                if (err) {
                                    console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
                                }
                                console.log('in deleteUser');
                                console.log(results);
                                resolve(results);
                            });
                        })];
            }
        });
    });
}
exports.deleteUser = deleteUser;
function removeUserFromGroups(user) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.delete('users_in_group', { field: 'user_id', value: user.id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
        });
    });
}
exports.removeUserFromGroups = removeUserFromGroups;
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