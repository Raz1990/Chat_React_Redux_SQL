"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(id, user_name, password, age) {
        this.id = id;
        this.user_name = user_name;
        this.password = password;
        this.age = age;
    }
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.getItems = function () {
        return [];
    };
    User.prototype.getType = function () {
        return "user";
    };
    User.prototype.getName = function () {
        return this.user_name;
    };
    User.prototype.setName = function (newName) {
        if (newName.length > 1) {
            this.user_name = newName;
        }
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.setPassword = function (newPass) {
        this.password = newPass;
    };
    User.prototype.getAge = function () {
        return this.age;
    };
    User.prototype.setAge = function (newAge) {
        this.age = newAge;
    };
    User.prototype.getInfoString = function () {
        return 'name: ' + this.user_name + ', age: ' + this.age + ', password: ' + this.password;
    };
    User.prototype.addUser = function () {
        console.log(this.user_name + 'to be added');
    };
    User.prototype.removeUser = function () {
        console.log(this.user_name + 'to be removed');
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map