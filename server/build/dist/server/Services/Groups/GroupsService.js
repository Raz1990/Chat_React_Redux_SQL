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
function addGroup(group_name, parent_id) {
    parent_id = parent_id || null;
    return new Promise(function (resolve, reject) {
        query = db_1.default.insert('groups', group_name, parent_id);
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.addGroup = addGroup;
function addUserToGroup(addingObject) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.insert('users_in_group', addingObject.host, addingObject.user);
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN INSERT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.addUserToGroup = addUserToGroup;
function getAllGroups() {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('*', 'groups');
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
exports.getAllGroups = getAllGroups;
function getGroupMembers(group_id) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.select('user_id', 'users_in_group', { field: 'host_id', value: group_id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            if (results.length > 0) {
                console.log(results);
                query = "SELECT * FROM users WHERE id IN (" + results.map(function (u) { return u.user_id; }) + ")";
                db.query(query, function (err, results) {
                    if (err) {
                        console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
                    }
                    console.log(results);
                    resolve(results);
                });
            }
            else {
                query = db_1.default.select('*', 'groups', { field: 'parent_id', value: group_id });
                db.query(query, function (err, results) {
                    if (err) {
                        console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
                    }
                    console.log(results);
                    resolve(results);
                });
            }
        });
    });
}
exports.getGroupMembers = getGroupMembers;
function getGroupById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    query = db_1.default.select('*', 'groups', { field: 'id', value: id });
                    db.query(query, function (err, results) {
                        if (err) {
                            console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
                        }
                        console.log(results[0]);
                        resolve(results[0]);
                    });
                })];
        });
    });
}
exports.getGroupById = getGroupById;
function updateGroup(group) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.update('groups', { field: 'id', value: group.id }, { field: 'group_name', value: group.group_name });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN UPDATE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.updateGroup = updateGroup;
function removeUserFromGroup(removingObject) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.delete('users_in_group', { field: 'host_id', value: removingObject.group_id }, { field: 'user_id', value: removingObject.user_id });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
exports.removeUserFromGroup = removeUserFromGroup;
function moveGroups(groups) {
    return new Promise(function (resolve, reject) {
        query = db_1.default.update('groups', { field: 'id', value: groups.mover }, { field: 'parent_id', value: groups.host });
        db.query(query, function (err, results) {
            if (err) {
                console.error("ERROR IN UPDATE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            resolve(results.affectedRows);
        });
    });
}
exports.moveGroups = moveGroups;
function deleteGroup(group, flatten) {
    return __awaiter(this, void 0, void 0, function () {
        var new_host_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!flatten) return [3 /*break*/, 3];
                    return [4 /*yield*/, getGroupParent(group.id)];
                case 1:
                    new_host_id = _a.sent();
                    return [4 /*yield*/, moveUsersToAnotherGroup(group, new_host_id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, deleteUsersFromAGroup(group)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, new Promise(function (resolve, reject) {
                        query = db_1.default.delete('groups', { field: 'id', value: group.id });
                        db.query(query, function (err, results) {
                            if (err) {
                                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
                            }
                            console.log(results);
                            resolve(results.affectedRows);
                        });
                    })];
            }
        });
    });
}
exports.deleteGroup = deleteGroup;
function getGroupParent(group_id) {
    var _this = this;
    //find the parent group id
    query = db_1.default.select('parent_id', 'groups', { field: 'id', value: group_id });
    db.query(query, function (err, results) { return __awaiter(_this, void 0, void 0, function () {
        var new_host_id;
        return __generator(this, function (_a) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            new_host_id = results[0].parent_id;
            console.log(new_host_id);
            return [2 /*return*/, new_host_id];
        });
    }); });
}
function moveUsersToAnotherGroup(group, new_host_id) {
    var _this = this;
    //find the group users
    query = db_1.default.select('user_id', 'users_in_group', { field: 'host_id', value: group.id });
    db.query(query, function (err, results) { return __awaiter(_this, void 0, void 0, function () {
        var user_members, _i, user_members_1, user;
        return __generator(this, function (_a) {
            if (err) {
                console.error("ERROR IN SELECT QUERY>>>>>>>>>", err);
            }
            user_members = results;
            console.log(user_members);
            //update the members to the new group
            for (_i = 0, user_members_1 = user_members; _i < user_members_1.length; _i++) {
                user = user_members_1[_i];
                query = db_1.default.update('users_in_group', { field: 'host_id', value: group.id }, { field: 'host_id', value: new_host_id }, { field: 'user_id', value: user.user_id });
                db.query(query, function (err, results) {
                    if (err) {
                        console.error("ERROR IN UPDATE QUERY>>>>>>>>>", err);
                    }
                    console.log(results);
                    return results;
                });
            }
            return [2 /*return*/];
        });
    }); });
}
function deleteUsersFromAGroup(group) {
    var _this = this;
    //delete the members from the old group
    query = db_1.default.delete('users_in_group', { field: 'host_id', value: group.id });
    db.query(query, function (err, results) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (err) {
                console.error("ERROR IN DELETE QUERY>>>>>>>>>", err);
            }
            console.log(results);
            return [2 /*return*/, results];
        });
    }); });
}
//# sourceMappingURL=GroupsService.js.map