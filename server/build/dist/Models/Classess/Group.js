"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Group = /** @class */ (function () {
    function Group(id, group_name, members, is_child, parent) {
        if (members === void 0) { members = []; }
        this.id = id;
        this.group_name = group_name;
        this.members = members;
        this.is_child = is_child;
        this.parent = parent;
    }
    Group.prototype.isChild = function () {
        return this.is_child;
    };
    Group.prototype.getId = function () {
        return this.id;
    };
    Group.prototype.setParentGroup = function (parent) {
        this.parent = parent;
    };
    Group.prototype.getParentGroup = function () {
        return this.parent;
    };
    Group.prototype.getItems = function () {
        return this.members;
    };
    Group.prototype.getType = function () {
        return "group";
    };
    Group.prototype.getName = function () {
        return this.group_name;
    };
    Group.prototype.setName = function (newName) {
        if (newName.length > 1) {
            this.group_name = newName;
        }
    };
    Group.prototype.getInfoString = function () {
        return 'name: ' + this.group_name + ' members: ' + this.members.map(function (userName) { return userName + ' , '; });
    };
    Group.prototype.getGroupMembers = function () {
        return this.members;
    };
    Group.prototype.addNewMember = function (newMember) {
        var type = newMember.getType();
        if (type === 'group') {
            this.addGroupToGroup(newMember);
        }
        else {
            this.addUserToGroup(newMember);
        }
    };
    Group.prototype.addGroupToGroup = function (newGroup) {
        this.members.push(newGroup);
    };
    Group.prototype.addUserToGroup = function (newUser) {
        this.members.push(newUser);
    };
    Group.prototype.removeUserFromGroup = function (newUser) {
        console.log(newUser.getName() + 'to be removed');
    };
    Group.prototype.addGroup = function () {
        console.log(this.group_name + 'to be added');
    };
    Group.prototype.removeGroup = function () {
        console.log(this.group_name + 'to be removed');
    };
    return Group;
}());
exports.Group = Group;
//# sourceMappingURL=Group.js.map