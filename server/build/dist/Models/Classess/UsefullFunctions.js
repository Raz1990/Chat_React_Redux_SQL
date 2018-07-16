"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./User");
var Group_1 = require("./Group");
var MyFunctions = /** @class */ (function () {
    function MyFunctions() {
    }
    MyFunctions.Userify = function (fakeUsers) {
        var usersARR = [];
        for (var _i = 0, fakeUsers_1 = fakeUsers; _i < fakeUsers_1.length; _i++) {
            var fakeUser = fakeUsers_1[_i];
            usersARR.push(new User_1.User(fakeUser.id, fakeUser.user_name, fakeUser.password, fakeUser.age));
        }
        return usersARR;
    };
    MyFunctions.UserifyOne = function (fakeUser) {
        return new User_1.User(fakeUser.id, fakeUser.user_name, fakeUser.password, fakeUser.age);
    };
    MyFunctions.Groupify = function (fakeGroups) {
        var groupsARR = [];
        for (var _i = 0, fakeGroups_1 = fakeGroups; _i < fakeGroups_1.length; _i++) {
            var fakeGroup = fakeGroups_1[_i];
            groupsARR.push(this._innerGroupify(fakeGroup));
        }
        this.groupParentify(groupsARR);
        return groupsARR;
    };
    MyFunctions._innerGroupify = function (fakeGroup) {
        var groupMembers = [];
        for (var _i = 0, _a = fakeGroup.members; _i < _a.length; _i++) {
            var member = _a[_i];
            //if it has members, that means its a group
            if (!member.members) {
                groupMembers.push(new User_1.User(member.id, member.user_name, member.password, member.age));
            }
            else {
                groupMembers.push(this._innerGroupify(member));
            }
        }
        return new Group_1.Group(fakeGroup.id, fakeGroup.group_name, groupMembers, fakeGroup.is_child);
    };
    MyFunctions.groupParentify = function (groupsARR) {
        for (var _i = 0, groupsARR_1 = groupsARR; _i < groupsARR_1.length; _i++) {
            var parentGroup = groupsARR_1[_i];
            for (var _a = 0, _b = parentGroup.getGroupMembers(); _a < _b.length; _a++) {
                var childGroup = _b[_a];
                if (childGroup.getType() === 'group') {
                    childGroup.setParentGroup(parentGroup);
                }
                else {
                    break;
                }
                if (childGroup.getGroupMembers()) {
                    this.groupParentify([childGroup]);
                }
            }
        }
    };
    return MyFunctions;
}());
exports.default = MyFunctions;
//# sourceMappingURL=UsefullFunctions.js.map