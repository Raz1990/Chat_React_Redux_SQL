import {User} from "./User";
import {Group} from "./Group";
import * as io from "socket.io-client";
import {store} from "../Redux/store";
import * as actions from './../Redux/actions';
import {ServerAPI} from "../ServerAPI";

const socket = io('http://localhost:4000');

class Helpers {

    static async storeAllEntities(){
        await Helpers.storeUsers();
        await Helpers.storeGroups();

        let entityArray;

        entityArray = [].concat(store.getState()['allGroups']).concat(store.getState()['allUsers']);

        store.dispatch(actions.setChatEntities(entityArray));
    }

    static storeUsers = async () => {
        await ServerAPI.getUsers()
            .then((users) => {
                users = Helpers.Userify(users);
                store.dispatch(actions.setAllUsers(users));
            });
    };

    static storeGroups = async () => {
        await ServerAPI.getGroups()
            .then(async (groups) => {
                await ServerAPI.getAllUsersInGroups()
                    .then((groupMembers) => {
                        groups = Helpers.Groupify(groups,groupMembers,store.getState()['allUsers']);
                        store.dispatch(actions.setAllGroups(groups));
                    });
            });

    };

    static startTheIO = () => {
        socket.on('chat', () => {
            store.dispatch(actions.refresh())
        });
    };

    static _io = Helpers.startTheIO();

    static emitTheIO = (text) => {
        socket.emit(text);
    };

    static Userify(userObjects){
        let usersARR = [];
        for (const userObject of userObjects){
            usersARR.push(new User(userObject.id,userObject.user_name,userObject.password,userObject.age));
        }
        return usersARR;
    }

    static Groupify(groupObjects, memberObjects, users){
        let groupsARR = [];
        let parentIds = [];
        for (const groupObject of groupObjects){
            let group = new Group(groupObject.id, groupObject.group_name);
            parentIds.push(groupObject.parent_id);
            groupsARR.push(group);
        }
        this.groupParentify(groupsARR,parentIds);
        this.groupMemberfy(groupsARR,memberObjects,users);

        return groupsARR;
    }

    static groupParentify(groupsARR,parentIds){
        let i = 0;
        for (const group of groupsARR){
            let parentId = parentIds[i++];
            if (parentId){
                let parentGroup = groupsARR.find(g => g.id === parentId);
                group.setParentGroup(parentGroup);
                group.is_child = true;
                parentGroup.addNewMember(group);
            }
            else {
                group.is_child = false;
                group.setParentGroup(null);
            }
        }
    }

    static groupMemberfy(groups,memberObjects,users){
        //memberObjects -> host_id - parent group, user_id
        for (const member of memberObjects) {
            let thisGroup = groups.find(g => g.getId() === member.host_id);
            let thisUser = users.find(u => u.getId() === member.user_id);
            thisGroup.addNewMember(thisUser);
        }
    }

    //gets an element and gives it the "disabled" class
    static makeActive = (element: any) => {

        let workingElement = element.target;

        if (!workingElement) {
            workingElement = element;
        }

        Helpers.removeActive();

        //add the disabled status to the selected element
        workingElement.classList.toggle('active');

        let chattingWith;

        if (workingElement.classList.contains('noChat')) {
            chattingWith = null;
        }
        else {
            chattingWith = Helpers.getChatEntity(parseInt(workingElement.id), workingElement.innerText);
        }

        store.dispatch(actions.setInChatWith(chattingWith));
        store.dispatch(actions.setChatElement(workingElement));
    };

    static getChatEntity(id: number, name: string) {
        let entity;
        const users = store.getState()['allUsers'];
        const groups = store.getState()['allGroups'];

        entity = users.find(o => o.getId() === id && o.getName() === name);
        if (!entity){
            entity = groups.find(o => o.getId() === id && o.getName() === name);
        }

        return entity;
    }

    static removeActive(){
        //remove disabled status from any previous disabled
        let currentlyActive = document.getElementsByClassName('active');
        if (currentlyActive.length > 0) {
            currentlyActive[0].classList.toggle('active');
        }
    }

    //gets an element and expands / collapses all of its children (if have any)
    static decideVisibility = (element: any) => {

        let workingElement = element.target;

        if (!workingElement) {
            workingElement = element;
        }

        let eleChildren = Helpers.getElementChildren(workingElement);

        if (!eleChildren) {
            return;
        }

        for (let i=0; i<eleChildren.length; i++){

            let child = eleChildren[i];

            child.classList.toggle('isHidden');
            const innerChildHidden = Helpers.areElementsHidden(Helpers.getElementChildren(child));
            if (child.classList.contains('isHidden') && !innerChildHidden) {
                Helpers.decideVisibility(child);
            }
        }

        // for (let child of eleChildren) {
        //     child.classList.toggle('isHidden');
        //     const innerChildHidden = this.areElementsHidden(this.getElementChildren(child));
        //     if (child.classList.contains('isHidden') && !innerChildHidden) {
        //         this.decideVisibility(child);
        //     }
        // }
    };

    //gets an array of elements, and returns true if one of them has isHidden class
    static areElementsHidden(childrenArray: any) {
        for (const child of childrenArray) {
            if (!child.classList.contains('isHidden')) {
                return false;
            }
        }
        return true;
    }

    static getElementParent(element: any) {
        //classList[4] = childOf_*** (parent group)
        //substring(8) = just the ***
        if (element.classList[3]) {
            const className = element.classList[3].substring(8);
            const parent = document.getElementsByClassName(className)[0];
            return parent;
        }
        return null;
    }

    static getElementChildren(element: any) {
        const className = element.classList[1];
        const children = document.getElementsByClassName('childOf_' + className);
        return children;
    }

    static setUpKeysEvents(element: any){
        element.addEventListener('keydown', this.decideAction);
    }

    static decideAction = (event: any) => {
        const currentlyActive = document.getElementsByClassName('active')[0];
        let liChildren, liParent;
        if (currentlyActive) {
            liChildren = Helpers.getElementChildren(currentlyActive);
            liParent = Helpers.getElementParent(currentlyActive);
        }

        switch (event.key) {
            case 'ArrowDown':
                Helpers.dealWithDown(currentlyActive,liChildren,liParent);
                break;
            case 'ArrowUp':
                Helpers.dealWithUp(currentlyActive);
                break;
            case 'Enter':
                Helpers.dealWithEnter(currentlyActive, liChildren);
                break;
            case 'ArrowRight':
                Helpers.dealWithRight(currentlyActive, liChildren);
                break;
            case 'ArrowLeft':
                Helpers.dealWithLeft(currentlyActive, liChildren, liParent);
                break;
        }
    };

    static dealWithDown = (currentlyActive: any, liChildren: any, liParent: any) => {
        ///FEATURE
        //Check if there is a li to disabled if none are disabled
        const allLis = document.getElementsByTagName('li');
        const firstLi = allLis[0];
        if (!currentlyActive && firstLi){
            Helpers.makeActive(firstLi);
        }

        //if nothing is disabled, and no li in sight, simply go back
        if (!currentlyActive) {
            return;
        }

        let eleToActive, idNow;

        //check if its a group
        if (currentlyActive.classList.contains('group')) {
            //get its children
            liChildren = Helpers.getElementChildren(currentlyActive);
        }
        //if it's a child of another element, get the parent
        if (currentlyActive.classList.contains('childElement')) {
            liParent = Helpers.getElementParent(currentlyActive);
        }

        idNow = parseInt(currentlyActive.dataset.orderid);

        const lastLi = allLis[allLis.length-1];

        if (idNow === parseInt(lastLi.dataset.orderid)) {
            return;
        }

        //if has children and
        //those children are visible and can be moved to
        if (liChildren && !Helpers.areElementsHidden(liChildren)) {
            eleToActive = liChildren[0];
        }
        else {
            if(liParent){
                let parentsChildren = Helpers.getElementChildren(liParent);
                let lastChild: any = parentsChildren[parentsChildren.length - 1];
                //if i'm the last disabled child
                if (parseInt(lastChild.dataset.orderid) === idNow) {
                    //take my par-parent's id
                    let liParParent: any = Helpers.getElementParent(liParent);
                    if (liParParent) {
                        idNow = parseInt(liParParent.dataset.orderid);
                    }
                    else {
                        idNow = parseInt(liParent.dataset.orderid);
                    }
                }
            }
            idNow++;
            const queryString = "[data-orderid='"+idNow+"']";
            eleToActive = document.querySelector(queryString);
        }

        Helpers.makeActive(eleToActive);
    };

    static dealWithUp = (currentlyActive: any) => {
        let eleToActive, idNow, previousLi;

        idNow = parseInt(currentlyActive.dataset.orderid);

        if (idNow === 1) {
            return;
        }

        previousLi = currentlyActive.previousSibling;

        do {
            eleToActive = previousLi;
            if (eleToActive.classList.contains('isHidden')) {
                previousLi = previousLi.previousSibling;
            }
        }while (eleToActive.classList.contains('isHidden'));

        Helpers.makeActive(eleToActive);
    };

    static dealWithLeft = (currentlyActive: any, liChildren: any, liParent: any) => {

        if (liChildren) {
            if (!Helpers.areElementsHidden(liChildren)) {
                Helpers.decideVisibility(currentlyActive);
            }
            else if (liParent) {
                if (Helpers.areElementsHidden(Helpers.getElementChildren(liParent))) {
                    Helpers.decideVisibility(liParent);
                }
                Helpers.makeActive(liParent);
            }
        }
        else if (liParent) {
            if (Helpers.areElementsHidden(Helpers.getElementChildren(liParent))) {
                Helpers.decideVisibility(liParent);
            }
            else {
                Helpers.makeActive(liParent);
            }
        }
    };

    static dealWithRight = (currentlyActive: any, liChildren: any) => {
        //if it has children
        if (liChildren.length > 0) {
            //if any of my children are hidden, i will hide myself
            if (Helpers.areElementsHidden(liChildren)) {
                Helpers.decideVisibility(currentlyActive);
            }
            //makeActive(liChildren[0]);
        }
    };

    static dealWithEnter = (currentlyActive: any, liChildren: any) => {
        //if it has children
        if (liChildren.length > 0) {
            Helpers.decideVisibility(currentlyActive);
        }
    };

    static replies = {};

    static AIReply(receiver:string){

        const rand = Math.floor(Math.random() * Helpers.replies[receiver].length);

        const reply = Helpers.replies[receiver][rand];

        return reply;
    }

    static generateMockUpAnswers(){
        Helpers.replies['Raz'] = ['פיצה ויומנגס וצ\'יפס','מה הקטע לדבר עם עצמך?', 'מדבר עם עצמך? באמת?', 'רפלקציה עצמית זה מגניב', 'מה נסגר לדבר עם עצמך?', 'הד הד הדדד', 'המחלקה הפסיכיאטרית בכיוון ההוא'];
        Helpers.replies['Moshe'] = ['הכל חרטא ברטא תאמין לי','יש לי נוד שמביא צ\'ילדרן של נאד','אמן','לא אכפת לי, אתה צדיק'];
        Helpers.replies['Itay'] = ['עכשיו תוסיף עוד 100 ש"ח','זה גורם למיינד פאק רציני','מארוול וDC הם אחלה','חם פה אש','אני שולח את זה לAPI חיצוני','אחלה AI לתשובות עשית', 'coc.png'];
        Helpers.replies['Evgeni'] = ['יאללה לאכול','משהו פה לא מסתדר לי','צאו להפסקה'];
        Helpers.replies['Ori'] = ['מגניב!','אז מה למדנו היום?','זה אוכל את זה?', 'נחמד','אני עושה npm i npm start וזהו'];
        Helpers.replies['Yuval'] = ['עוגי שיגעוגי','פאו צ\'יקא-וואו-וואו','קמהאמאה!!!','HERO   ore o tataeru koe ya   kassai nante   hoshikute wa nai sa!!!','Ka ka ka ka kachi daze!!!','Omae Wa Mou Shindeiru!'];
        Helpers.replies['Best Friends'] = ['איתי: ' + ': טוב לא חשוב הקראק נשאר אצלי', 'משה: ' + ': קראק זה חרטא ברטא', 'איתי: ' +  ': אתם מפספסים אחלה קראק', 'משה: ' +  ': מישהו יכול לעזור לי עם הנוד שלי?', 'איתי: ' + ': חברים חפרתם'];
        //Helpers.replies['Best Friends'] = ['תשובה גנרית'];
    }

    static _replies = Helpers.generateMockUpAnswers();

    static compare(a: any, b: any) {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }
}

export default Helpers;