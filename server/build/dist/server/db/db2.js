"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var UsefullFunctions_1 = require("./../Models/Classess/UsefullFunctions");
var Db2 = /** @class */ (function () {
    function Db2() {
        this.replies = {};
        this.updateDB();
        this.generateMockUpAnswers();
    }
    Db2.prototype.updateDB = function () {
        var fileName = "Users";
        this.users = Db2.readFromJson(fileName).users;
        fileName = "Groups";
        this.groups = Db2.readFromJson(fileName).groups;
        //this.users = Helpers.Userify(Db2.readFromJson(fileName).users);
        //this.groups = Helpers.Groupify(Db2.readFromJson(fileName).groups);
    };
    Db2.getInstance = function () {
        if (!Db2.instance) {
            Db2.instance = new Db2();
        }
        return Db2.instance;
    };
    Db2.readFromJson = function (fileName) {
        var data = "";
        try {
            data = fs.readFileSync(__dirname + "/JSONData/" + fileName + "Data.json", "UTF-8");
        }
        catch (e) {
            console.log('ERROR READING JSON', e);
        }
        return JSON.parse(data);
    };
    Db2.prototype.writeToJson = function (fileName, outerData) {
        var data;
        switch (fileName) {
            case "Users":
                data = { users: this.users };
                break;
            case "Groups":
                data = { groups: this.groups };
                break;
            default:
                data = outerData;
                break;
        }
        try {
            fs.writeFileSync(__dirname + "/JSONData/" + fileName + "Data.json", JSON.stringify(data), "UTF-8");
        }
        catch (e) {
            console.log('ERROR WRITING TO JSON -> ', e);
        }
    };
    //static users = TempData.allUsers;
    //static groups = TempData.allGroups;
    Db2.prototype.getAllEntities = function () {
        var entityArray = [];
        entityArray = entityArray.concat(UsefullFunctions_1.default.Groupify(this.groups)).concat(UsefullFunctions_1.default.Userify(this.users));
        return entityArray;
    };
    Db2.prototype.getAllUsers = function () {
        return this.users;
    };
    Db2.prototype.getAllGroups = function () {
        return this.groups;
    };
    Db2.prototype.getSingleUser = function (userName, password) {
        var foundUser;
        if (password) {
            try {
                foundUser = this.users.find(function (o) { return o["user_name"] === userName && o["password"] === password; });
            }
            catch (e) {
                console.log("ERROR", e);
            }
        }
        else {
            foundUser = this.users.find(function (o) { return o["user_name"] === userName; });
        }
        return UsefullFunctions_1.default.UserifyOne(foundUser);
    };
    Db2.prototype.getUserById = function (id) {
        var foundUser = this.users.find(function (o) { return o["id"] === id; });
        return foundUser;
    };
    Db2.prototype.getSingleGroup = function (groupName) {
        var foundGroup = UsefullFunctions_1.default.Groupify(this.groups).find(function (o) { return o["group_name"] === groupName; });
        return foundGroup;
    };
    Db2.prototype.getChatEntity = function (name) {
        var entity;
        entity = this.users.find(function (o) { return o["user_name"] === name; });
        if (!entity) {
            entity = this.groups.find(function (o) { return o["group_name"] === name; });
        }
        return entity;
    };
    Db2.prototype.addMessageToAConversation = function (senderName, receiverName, type, content, time) {
        var sender = this.getSingleUser(senderName);
        var receiver;
        if (type === 'group') {
            receiver = this.getSingleGroup(receiverName);
        }
        else {
            receiver = this.getSingleUser(receiverName);
        }
        return this.addConversation(sender, receiver, content, time, true);
    };
    Db2.prototype.addConversation = function (sender, receiver, content, time, real) {
        var messages = Db2.readFromJson("Messages");
        //if its the first time the sender ever sent a message
        if (!messages[sender.getName()]) {
            messages[sender.getName()] = {};
        }
        //will be useful in the future when getting info from the db
        var bubbleId = 0;
        //if its the first time the sender sent a message to a specific entity
        if (!messages[sender.getName()][receiver.getName()]) {
            messages[sender.getName()][receiver.getName()] = { val: [] };
        }
        else {
            var convo = messages[sender.getName()][receiver.getName()].val;
            bubbleId = convo[convo.length - 1].id + 1;
        }
        //add the "bubble" to the correct conversation
        messages[sender.getName()][receiver.getName()].val.push(this.newBubble(bubbleId, sender, receiver, content, time));
        //the actual "saving" part of the message in the "Db2"
        this.writeToJson("Messages", messages);
        //an echo back when talking "live"
        if (real) {
            if (receiver.getType() === 'group') {
                // currently sticks the convo to a static user,
                // in reality it will get the real sending user from the server
                //this.addConversation(this.Itay, receiver, this.AIReply(receiver.getName()), time);
            }
            else {
                this.addConversation(receiver, sender, this.AIReply(receiver.getName()), time);
            }
        }
        return true;
    };
    Db2.prototype.newBubble = function (bubbleId, sender, receiver, content, time) {
        return {
            id: bubbleId,
            content: content,
            sender: { id: sender.getId(), name: sender.getName() },
            receiver: { id: receiver.getId(), name: receiver.getName() },
            timeSent: time
        };
    };
    Db2.prototype.AIReply = function (receiver) {
        var rand = Math.floor(Math.random() * this.replies[receiver].length);
        var reply = this.replies[receiver][rand];
        return reply;
    };
    Db2.prototype.generateMockUpAnswers = function () {
        this.replies['Raz'] = ['פיצה ויומנגס וצ\'יפס', 'מה הקטע לדבר עם עצמך?', 'מדבר עם עצמך? באמת?', 'רפלקציה עצמית זה מגניב', 'מה נסגר לדבר עם עצמך?', 'הד הד הדדד', 'המחלקה הפסיכיאטרית בכיוון ההוא'];
        this.replies['Moshe'] = ['הכל חרטא ברטא תאמין לי', 'יש לי נוד שמביא צ\'ילדרן של נאד', 'אמן', 'לא אכפת לי, אתה צדיק'];
        this.replies['Itay'] = ['עכשיו תוסיף עוד 100 ש"ח', 'זה גורם למיינד פאק רציני', 'מארוול וDC הם אחלה', 'חם פה אש', 'אני שולח את זה לAPI חיצוני', 'אחלה AI לתשובות עשית', 'coc.png'];
        this.replies['Evgeni'] = ['יאללה לאכול', 'משהו פה לא מסתדר לי', 'צאו להפסקה'];
        this.replies['Ori'] = ['מגניב!', 'אז מה למדנו היום?', 'זה אוכל את זה?', 'נחמד', 'אני עושה npm i npm start וזהו'];
        this.replies['Yuval'] = ['עוגי שיגעוגי', 'פאו צ\'יקא-וואו-וואו', 'קמהאמאה!!!', 'HERO   ore o tataeru koe ya   kassai nante   hoshikute wa nai sa!!!', 'Ka ka ka ka kachi daze!!!', 'Omae Wa Mou Shindeiru!'];
        //this.replies['Friends'] = [this.users[0].getName() + ': טוב לא חשוב הקראק נשאר אצלי', TempData.Moshe.getName() + ': קראק זה חרטא ברטא', TempData.Itay.getName() + ': אתם מפספסים אחלה קראק', TempData.Moshe.getName() + ': מישהו יכול לעזור לי עם הנוד שלי?', TempData.Itay.getName() + ': חברים חפרתם'];
        this.replies['Best Friends'] = ['תשובה גנרית'];
    };
    Db2.prototype.getMessageHistory = function (senderName, receiverName, receiverType) {
        var sender = this.getSingleUser(senderName);
        var receiver;
        if (receiverType === "group") {
            receiver = this.getSingleGroup(receiverName);
        }
        else {
            receiver = this.getSingleUser(receiverName);
        }
        var convo = this.getConversation(sender, receiver);
        //erase the seconds from the time displayed
        // for (let message of convo) {
        //     message.timeSent = message.timeSent.substring(0,5);
        // }
        return convo;
    };
    Db2.prototype.getConversation = function (sender, receiver) {
        var messages = Db2.readFromJson("Messages");
        if (!messages[sender.getName()]) {
            messages[sender.getName()] = {};
        }
        if (messages[sender.getName()][receiver.getName()]) {
            var convo = [];
            //the entity is a group and has many senders
            if (receiver.getType() === 'group') {
                var group = receiver;
                for (var _i = 0, _a = group.getGroupMembers(); _i < _a.length; _i++) {
                    var groupMember = _a[_i];
                    if (groupMember.getType() != 'group' && messages[groupMember.getName()]) {
                        if (messages[groupMember.getName()][receiver.getName()]) {
                            convo = convo.concat(messages[groupMember.getName()][receiver.getName()].val);
                        }
                    }
                }
            }
            //the entity is a single user and has only one sender and receiver
            else {
                convo = convo.concat(messages[sender.getName()][receiver.getName()].val);
                //temporary check if its the same fag talking to himself
                if (sender === receiver) { }
                else {
                    //if the receiver has a conversation of any sort
                    if (messages[receiver.getName()]) {
                        convo = convo.concat(messages[receiver.getName()][sender.getName()].val);
                    }
                }
            }
            convo.sort(this.compare);
            return convo;
        }
        return [];
    };
    Db2.prototype.compare = function (a, b) {
        if (a.timeSent < b.timeSent) {
            return -1;
        }
        if (a.timeSent > b.timeSent) {
            return 1;
        }
        // a must be equal to b
        return 0;
    };
    // adding
    Db2.prototype.addUser = function (user) {
        if (this.users.find(function (o) { return o.getName() === user.user_name; })) {
            return "";
        }
        user.id = this.users.length + 1;
        this.users.push(user);
        this.writeToJson("Users");
        return this.users;
    };
    Db2.prototype.addGroup = function (group) {
        if (this.groups.find(function (o) { return o.group_name === group.group_name; })) {
            return "";
        }
        group.id = this.groups.length + 1;
        group.members = [];
        this.groups.push(group);
        this.writeToJson("Groups");
        return this.groups;
    };
    // delete
    Db2.prototype.deleteUser = function (user) {
        var userToDelete = this.users.find(function (o) { return o.user_name === user.user_name; });
        //first, check if the user is in a group(s)
        //if any are found, they will be removed
        this.deleteUserInGroups(userToDelete);
        this.writeToJson("Groups");
        var index = this.users.indexOf(userToDelete);
        this.users.splice(index, 1);
        this.writeToJson("Users");
        return this.users;
    };
    Db2.prototype.deleteUserInSingleGroup = function (userToSearch, group) {
        var user_to_del = group.members.find(function (o) { return o.user_name === userToSearch.user_name; });
        //get the index of the user in the group
        var index = group.members.indexOf(user_to_del);
        //remove the user in the correct index from the group
        group.members.splice(index, 1);
    };
    Db2.prototype.deleteUserInGroups = function (userToSearch, group) {
        //if group is not provided, default to beginning
        group = group || this.groups[0];
        for (var _i = 0, _a = group.members; _i < _a.length; _i++) {
            var subGroup = _a[_i];
            //if a group has groups within it
            if (subGroup.members.length > 0) {
                if (subGroup.members[0].type === 'group') {
                    this.deleteUserInGroups(userToSearch, subGroup);
                }
            }
            if (subGroup.members.find(function (o) { return o.user_name === userToSearch.user_name; })) {
                this.deleteUserInSingleGroup(userToSearch, subGroup);
            }
        }
    };
    Db2.prototype.deleteGroup = function (group, flatten) {
        var groupToDelete = this.groups.find(function (o) { return o.group_name === group.group_name; });
        if (flatten) {
            this.flattenGroup(group);
        }
        else {
            var groupToDeleteParent = this.groups.find(function (o) { return o.group_name === group.parent; });
            var childOfParent = groupToDeleteParent.members.find(function (o) { return o.group_name === group.group_name; });
            var index_1 = groupToDeleteParent.members.indexOf(childOfParent);
            groupToDeleteParent.members.splice(index_1, 1);
        }
        var index = this.groups.indexOf(groupToDelete);
        this.groups.splice(index, 1);
        this.writeToJson("Groups");
        return this.groups;
    };
    Db2.prototype.removeUserFromGroup = function (groupName, userName) {
        var userToDelete;
        var groupToDeleteFrom;
        var parentName;
        do {
            userToDelete = this.users.find(function (o) { return o.user_name === userName; });
            groupToDeleteFrom = this.groups.find(function (o) { return o.group_name === groupName; });
            parentName = groupToDeleteFrom.parent;
            if (parentName) {
                var parent_1 = this.groups.find(function (o) { return o.group_name === parentName; });
                var childOfParent = parent_1.members.find(function (o) { return o.group_name === groupName; });
                this.deleteUserInSingleGroup(userToDelete, childOfParent);
            }
        } while (parentName);
        this.deleteUserInSingleGroup(userToDelete, groupToDeleteFrom);
        this.writeToJson("Groups");
        return this.groups;
    };
    Db2.prototype.flattenGroup = function (groupToFlatten) {
        var groupToDeleteParent = this.groups.find(function (o) { return o.group_name === groupToFlatten.parent; });
        if (groupToDeleteParent.members.length === 1) {
            groupToDeleteParent.members = groupToFlatten.members;
        }
    };
    // update
    Db2.prototype.updateUser = function (user) {
        var myUser;
        try {
            myUser = this.users.find(function (o) { return o.user_name === user.user_name; });
        }
        catch (e) {
            console.log(e);
        }
        myUser.password = user.password;
        myUser.age = user.age;
        this.writeToJson("Users");
        this.updateDB();
        return this.users;
    };
    Db2.prototype.updateGroup = function (group) {
        var myGroup;
        try {
            myGroup = this.groups.find(function (o) { return o.id === group.id; });
        }
        catch (e) {
            console.log(e);
        }
        //update the message array with the new group name
        var messages = Db2.readFromJson("Messages");
        for (var senderKey in messages) {
            if (senderKey === myGroup.group_name) {
                senderKey = group.group_name;
            }
            var sender = messages[senderKey];
            for (var receiverKey in sender) {
                if (receiverKey === myGroup.group_name) {
                    sender[group.group_name] = sender[receiverKey];
                    sender[receiverKey] = null;
                }
            }
        }
        this.writeToJson("Messages", messages);
        //if the group has a parent
        var parentName = myGroup.parent;
        if (parentName) {
            var parent_2 = this.groups.find(function (o) { return o.group_name == parentName; });
            var subGroupInOriginalParent = parent_2.members.find(function (o) { return o.group_name === group.original_group_name; });
            var groupToUpdate = this.getSingleGroup(subGroupInOriginalParent.group_name);
            groupToUpdate.group_name = group.group_name;
            groupToUpdate.parent = group.group_name;
            var index = this.groups.indexOf(groupToUpdate);
            parent_2.members.splice(index, 1, groupToUpdate);
        }
        myGroup.group_name = group.group_name;
        this.writeToJson("Groups");
        this.updateDB();
        return this.groups;
    };
    Db2.prototype.moveGroups = function (host, moving) {
        var hoster, mover;
        try {
            hoster = this.groups.find(function (o) { return o.group_name === host; });
            mover = this.groups.find(function (o) { return o.group_name === moving; });
        }
        catch (e) {
            console.log(e);
        }
        //if the mover already has a parent
        if (mover.parent) {
            //delete the group from the members of it's parent
            var moverParent = this.groups.find(function (o) { return o.group_name === mover.parent; });
            var subGroupInOriginalParent = moverParent.members.find(function (o) { return o.group_name === mover.group_name; });
            var groupToDelete = this.getSingleGroup(subGroupInOriginalParent.group_name);
            var index = this.groups.indexOf(groupToDelete);
            moverParent.members.splice(index, 1);
        }
        //move it to the other parent
        mover.parent = hoster.group_name;
        mover.is_child = true;
        hoster.members.push(mover);
        this.writeToJson("Groups");
        return this.groups;
    };
    Db2.prototype.addUserToGroup = function (groupName, userName) {
        var myGroup;
        try {
            myGroup = this.groups.find(function (o) { return o.group_name === groupName; });
        }
        catch (e) {
            console.log(e);
        }
        myGroup.members.push(this.getSingleUser(userName));
        //update the info on other groups
        //find the parent group
        var parent = this.groups.find(function (o) { return o.group_name === myGroup.parent; });
        if (parent) {
            //find the sub group within the parent
            var subGroup = parent.members.find(function (o) { return o.group_name === groupName; });
            subGroup.members = myGroup.members;
        }
        this.writeToJson("Groups");
        this.updateDB();
        return this.groups;
    };
    return Db2;
}());
exports.default = Db2;
//# sourceMappingURL=db2.js.map