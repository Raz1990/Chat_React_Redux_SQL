import * as fs from 'fs';

import ICanChat from "./../Models/Interfaces/ChatEntity";
import {Group} from "./../Models/Classess/Group";
import {User} from "./../Models/Classess/User";
import MyFunctions from "./../Models/Classess/UsefullFunctions";

class Db2 {

    users : User[];
    groups : Group[];
    replies = {};

    constructor() {
        this.updateDB();
        this.generateMockUpAnswers();
    }

    updateDB() {
        let fileName = "Users";
        this.users = Db2.readFromJson(fileName).users;
        fileName = "Groups";
        this.groups = Db2.readFromJson(fileName).groups;

        //this.users = MyFunctions.Userify(Db2.readFromJson(fileName).users);
        //this.groups = MyFunctions.Groupify(Db2.readFromJson(fileName).groups);
    }

    static instance: Db2;

    static getInstance(){
        if (!Db2.instance){
            Db2.instance = new Db2();
        }

        return Db2.instance;
    }

    static readFromJson(fileName: string) {
        let data = "";
        try {
            data = fs.readFileSync(`${__dirname}/JSONData/${fileName}Data.json`, "UTF-8");
        }
        catch (e) {
            console.log('ERROR READING JSON',e);
        }
        return JSON.parse(data);
    }

    writeToJson(fileName: string, outerData?: any) {
        let data;
        switch (fileName) {
            case "Users":
                data = {users: this.users};
                break;
            case "Groups":
                data = {groups: this.groups};
                break;
            default:
                data = outerData;
                break;
        }
        try {
            fs.writeFileSync(`${__dirname}/JSONData/${fileName}Data.json`, JSON.stringify(data), "UTF-8");
        }
        catch (e) {
            console.log('ERROR WRITING TO JSON -> ', e);
        }
    }

    //static users = TempData.allUsers;
    //static groups = TempData.allGroups;

    getAllEntities() {
        let entityArray : ICanChat[] = [];

        entityArray = entityArray.concat(MyFunctions.Groupify(this.groups)).concat(MyFunctions.Userify(this.users));

        return entityArray;
    }

    getAllUsers(){
        return this.users;
    }

    getAllGroups(){
        return this.groups;
    }

    getSingleUser(userName: string, password?: string) {
        let foundUser;
        if (password) {
            try {
                foundUser = this.users.find( o=> o["user_name"] === userName && o["password"] === password);
            }catch (e) {
                console.log("ERROR",e);
            }
        }
        else {
            foundUser = this.users.find(o => o["user_name"] === userName);
        }
        return MyFunctions.UserifyOne(foundUser);
    }

    getUserById(id: number) {
        let foundUser = this.users.find(o => o["id"] === id);
        return foundUser;
    }

    getSingleGroup(groupName: string) {
        const foundGroup = MyFunctions.Groupify(this.groups).find(o => o["group_name"] === groupName);
        return foundGroup;
    }

    getChatEntity(name: string) {
        let entity;
        entity = this.users.find(o => o["user_name"] === name);
        if (!entity){
            entity = this.groups.find(o => o["group_name"] === name);
        }

        return entity;
    }

    addMessageToAConversation(senderName: string, receiverName: string, type: string, content: string, time: string){
        const sender = this.getSingleUser(senderName);
        let receiver;
        if (type === 'group'){
            receiver = this.getSingleGroup(receiverName);
        }
        else {
            receiver = this.getSingleUser(receiverName);
        }

        return this.addConversation(sender, receiver, content, time,true);
    }

    addConversation(sender: ICanChat, receiver: ICanChat, content: string, time: string, real?: boolean){
        const messages = Db2.readFromJson("Messages");
        //if its the first time the sender ever sent a message
        if (!messages[sender.getName()]) {
            messages[sender.getName()] = {};
        }

        //will be useful in the future when getting info from the db
        let bubbleId = 0;

        //if its the first time the sender sent a message to a specific entity
        if (!messages[sender.getName()][receiver.getName()]) {
            messages[sender.getName()][receiver.getName()] = {val:[]};
        }
        else {
            const convo = messages[sender.getName()][receiver.getName()].val;
            bubbleId = convo[convo.length-1].id + 1;
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
    }

    newBubble(bubbleId: Number, sender: ICanChat, receiver: ICanChat, content: string, time: string){
        return {
            id : bubbleId,
            content: content,
            sender: {id: sender.getId(), name: sender.getName()},
            receiver: {id: receiver.getId(), name: receiver.getName()},
            timeSent: time
        };
    }

    AIReply(receiver:string){

        const rand = Math.floor(Math.random() * this.replies[receiver].length);

        const reply = this.replies[receiver][rand];

        return reply;
    }

    generateMockUpAnswers(){
        this.replies['Raz'] = ['פיצה ויומנגס וצ\'יפס','מה הקטע לדבר עם עצמך?', 'מדבר עם עצמך? באמת?', 'רפלקציה עצמית זה מגניב', 'מה נסגר לדבר עם עצמך?', 'הד הד הדדד', 'המחלקה הפסיכיאטרית בכיוון ההוא'];
        this.replies['Moshe'] = ['הכל חרטא ברטא תאמין לי','יש לי נוד שמביא צ\'ילדרן של נאד','אמן','לא אכפת לי, אתה צדיק'];
        this.replies['Itay'] = ['עכשיו תוסיף עוד 100 ש"ח','זה גורם למיינד פאק רציני','מארוול וDC הם אחלה','חם פה אש','אני שולח את זה לAPI חיצוני','אחלה AI לתשובות עשית', 'coc.png'];
        this.replies['Evgeni'] = ['יאללה לאכול','משהו פה לא מסתדר לי','צאו להפסקה'];
        this.replies['Ori'] = ['מגניב!','אז מה למדנו היום?','זה אוכל את זה?', 'נחמד','אני עושה npm i npm start וזהו'];
        this.replies['Yuval'] = ['עוגי שיגעוגי','פאו צ\'יקא-וואו-וואו','קמהאמאה!!!','HERO   ore o tataeru koe ya   kassai nante   hoshikute wa nai sa!!!','Ka ka ka ka kachi daze!!!','Omae Wa Mou Shindeiru!'];
        //this.replies['Friends'] = [this.users[0].getName() + ': טוב לא חשוב הקראק נשאר אצלי', TempData.Moshe.getName() + ': קראק זה חרטא ברטא', TempData.Itay.getName() + ': אתם מפספסים אחלה קראק', TempData.Moshe.getName() + ': מישהו יכול לעזור לי עם הנוד שלי?', TempData.Itay.getName() + ': חברים חפרתם'];
        this.replies['Best Friends'] = ['תשובה גנרית'];
    }

    getMessageHistory(senderName: string, receiverName: string, receiverType: string) {
        const sender = this.getSingleUser(senderName);
        let receiver;
        if (receiverType === "group"){
            receiver = this.getSingleGroup(receiverName);
        }
        else {
            receiver = this.getSingleUser(receiverName);
        }
        let convo = this.getConversation(sender,receiver);

        //erase the seconds from the time displayed
        // for (let message of convo) {
        //     message.timeSent = message.timeSent.substring(0,5);
        // }

        return convo;
    }

    getConversation(sender: ICanChat, receiver: ICanChat){
        const messages = Db2.readFromJson("Messages");
        if (!messages[sender.getName()]) {
            messages[sender.getName()] = {};
        }
        if (messages[sender.getName()][receiver.getName()]){

            let convo: any[] = [];

            //the entity is a group and has many senders
            if (receiver.getType() === 'group') {
                let group = receiver as Group;
                for (let groupMember of group.getGroupMembers()){
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
                if (sender === receiver) {}
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
    }

    compare(a: any, b: any) {
        if (a.timeSent < b.timeSent) {
            return -1;
        }
        if (a.timeSent > b.timeSent) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    // adding

    addUser(user){
        if (this.users.find(o => o.getName() === user.user_name)){
            return "";
        }

        user.id = this.users.length+1;
        this.users.push(user);
        this.writeToJson("Users");
        return this.users;
    }

    addGroup(group){
        if (this.groups.find(o => o.group_name === group.group_name)){
            return "";
        }

        group.id = this.groups.length+1;
        group.members = [];
        this.groups.push(group);
        this.writeToJson("Groups");
        return this.groups;
    }

    // delete

    deleteUser(user){
        const userToDelete = this.users.find(o => o.user_name === user.user_name);

        //first, check if the user is in a group(s)
        //if any are found, they will be removed
        this.deleteUserInGroups(userToDelete);
        this.writeToJson("Groups");

        const index = this.users.indexOf(userToDelete);
        this.users.splice(index, 1);
        this.writeToJson("Users");
        return this.users;
    }

    deleteUserInSingleGroup(userToSearch, group) {

        let user_to_del = group.members.find(o => o.user_name === userToSearch.user_name);

        //get the index of the user in the group
        const index = group.members.indexOf(user_to_del);

        //remove the user in the correct index from the group
        group.members.splice(index, 1);
    }

    deleteUserInGroups(userToSearch, group?) {
        //if group is not provided, default to beginning
        group = group || this.groups[0];

        for (const subGroup of group.members){
            //if a group has groups within it
            if (subGroup.members.length > 0) {
                if (subGroup.members[0].type === 'group') {
                    this.deleteUserInGroups(userToSearch, subGroup);
                }
            }
            if (subGroup.members.find(o => o.user_name === userToSearch.user_name)) {
                this.deleteUserInSingleGroup(userToSearch,subGroup);
            }
            //otherwise, user is not in the group, and cannot be removed
        }
    }

    deleteGroup(group, flatten?){
        const groupToDelete = this.groups.find(o => (<any>o.group_name) === group.group_name);
        if (flatten) {
            this.flattenGroup(group);
        }
        else {
            const groupToDeleteParent = this.groups.find(o => (<any>o.group_name) === group.parent);
            let childOfParent = groupToDeleteParent.members.find(o => o.group_name === group.group_name);
            let index = groupToDeleteParent.members.indexOf(childOfParent);
            groupToDeleteParent.members.splice(index, 1);
        }
        let index = this.groups.indexOf(groupToDelete);
        this.groups.splice(index, 1);

        this.writeToJson("Groups");
        return this.groups;
    }

    removeUserFromGroup(groupName, userName){
        let userToDelete;
        let groupToDeleteFrom;
        let parentName;
        do {
            userToDelete = this.users.find(o => o.user_name === userName);
            groupToDeleteFrom = this.groups.find(o => o.group_name === groupName);
            parentName = groupToDeleteFrom.parent;
            if (parentName) {
                let parent = this.groups.find(o => (<any>o.group_name) === parentName);
                let childOfParent = parent.members.find(o => o.group_name === groupName);
                this.deleteUserInSingleGroup(userToDelete, childOfParent);
            }
        }while(parentName);
        this.deleteUserInSingleGroup(userToDelete,groupToDeleteFrom);
        this.writeToJson("Groups");
        return this.groups;
    }

    flattenGroup(groupToFlatten){
        const groupToDeleteParent = this.groups.find(o => (<any>o.group_name) === groupToFlatten.parent);
        if (groupToDeleteParent.members.length === 1) {
            groupToDeleteParent.members = groupToFlatten.members;
        }
    }

    // update

    updateUser(user) {
        let myUser;
        try {
            myUser = this.users.find(o => o.user_name === user.user_name);
        } catch (e) {
            console.log(e);
        }
        myUser.password = user.password;
        myUser.age = user.age;
        this.writeToJson("Users");
        this.updateDB();
        return this.users;
    }

    updateGroup(group){
        let myGroup;
        try {
            myGroup = this.groups.find(o => o.id === group.id);
        } catch (e) {
            console.log(e);
        }

        //update the message array with the new group name
        const messages = Db2.readFromJson("Messages");
        for (let senderKey in messages){
            if (senderKey === myGroup.group_name) {
                senderKey = group.group_name;
            }
            let sender = messages[senderKey];
            for (let receiverKey in sender) {
                if (receiverKey === myGroup.group_name) {
                    sender[group.group_name] = sender[receiverKey];
                    sender[receiverKey] = null;
                }
            }
        }
        this.writeToJson("Messages", messages);

        //if the group has a parent
        let parentName: string = (<any>myGroup).parent;
        if (parentName){
            let parent = this.groups.find(o => o.group_name == parentName);
            let subGroupInOriginalParent = parent.members.find(o => o.group_name === group.original_group_name);
            const groupToUpdate = this.getSingleGroup(subGroupInOriginalParent.group_name);
            groupToUpdate.group_name = group.group_name;
            groupToUpdate.parent = group.group_name;
            const index = this.groups.indexOf(groupToUpdate);
            parent.members.splice(index, 1,groupToUpdate);
        }

        myGroup.group_name = group.group_name;
        this.writeToJson("Groups");
        this.updateDB();
        return this.groups;
    }

    moveGroups(host, moving){
        let hoster, mover;
        try {
            hoster = this.groups.find(o => o.group_name === host);
            mover = this.groups.find(o => o.group_name === moving);
        } catch (e) {
            console.log(e);
        }

        //if the mover already has a parent
        if (mover.parent){
            //delete the group from the members of it's parent
            let moverParent = this.groups.find(o => o.group_name === mover.parent);
            let subGroupInOriginalParent = moverParent.members.find(o => o.group_name === mover.group_name);
            const groupToDelete = this.getSingleGroup(subGroupInOriginalParent.group_name);
            const index = this.groups.indexOf(groupToDelete);
            moverParent.members.splice(index, 1);
        }

        //move it to the other parent
        mover.parent = hoster.group_name;
        mover.is_child = true;
        hoster.members.push(mover);
        this.writeToJson("Groups");
        return this.groups;
    }

    addUserToGroup(groupName, userName){
        let myGroup;
        try {
            myGroup = this.groups.find(o => o.group_name === groupName);
        } catch (e) {
            console.log(e);
        }
        myGroup.members.push(this.getSingleUser(userName));

        //update the info on other groups
        //find the parent group
        const parent = this.groups.find(o => o.group_name === myGroup.parent);

        if (parent) {
            //find the sub group within the parent
            let subGroup = parent.members.find(o => o.group_name === groupName);
            subGroup.members = myGroup.members;
        }

        this.writeToJson("Groups");
        this.updateDB();
        return this.groups;
    }
}

export default Db2;