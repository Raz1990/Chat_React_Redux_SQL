import {User} from "./User";
import {Group} from "./Group";
import StateStore from "./../State/StateStore";
import * as io from "socket.io-client";

const socket = io('http://localhost:4000');

class MyFunctions {
    static Userify(fakeUsers){
        let usersARR = [];
        for (const fakeUser of fakeUsers){
            usersARR.push(new User(fakeUser.id,fakeUser.user_name,fakeUser.password,fakeUser.age));
        }
        return usersARR;
    }

    static startTheIO = () => {
        socket.on('chat', () => {
            StateStore.getInstance().onStoreChanged();
        });
    };

    static _io = MyFunctions.startTheIO();

    static emitTheIO = (text) => {
        socket.emit(text);
    };

    static UserifyOne(fakeUser){
        return new User(fakeUser.id,fakeUser.user_name,fakeUser.password,fakeUser.age);
    }

    static Groupify(fakeGroups){
        let groupsARR = [];
        for (const fakeGroup of fakeGroups){
            groupsARR.push(this._innerGroupify(fakeGroup));
        }
        this.groupParentify(groupsARR);
        return groupsARR;
    }

    static _innerGroupify(fakeGroup){
        let groupMembers = [];

        for (const member of fakeGroup.members) {
            //if it has members, that means its a group
            if (!member.members){
                groupMembers.push(new User(member.id,member.user_name,member.password,member.age));
            }
            else {
                groupMembers.push(this._innerGroupify(member));
            }
        }

        return new Group(fakeGroup.id,fakeGroup.group_name,groupMembers,fakeGroup.is_child);
    }

    static groupParentify(groupsARR){
        //fix
        for (const parentGroup of groupsARR){
            for (const childGroup of parentGroup.getGroupMembers()){
                if (childGroup.getType() === 'group'){
                    childGroup.setParentGroup(parentGroup);
                }
                else{
                    break;
                }
                if (childGroup.getGroupMembers()) {
                    this.groupParentify([childGroup]);
                }
            }
        }
    }


    //gets an element and gives it the "disabled" class
    static makeActive = (element: any) => {

        let workingElement = element.target;

        if (!workingElement) {
            workingElement = element;
        }

        MyFunctions.removeActive();

        //add the disabled status to the selected element
        workingElement.classList.toggle('active');

        let stateStore = StateStore.getInstance();
        let chattingWith;

        if (workingElement.classList.contains('noChat')) {
            chattingWith = null;
        }
        else {
            chattingWith = MyFunctions.getChatEntity(workingElement.innerText);
        }

        if (chattingWith!= null){
            if (chattingWith.members){
                chattingWith = MyFunctions.Groupify([chattingWith]).find(o => o.group_name === chattingWith.group_name);
            }
            else {
                    chattingWith = MyFunctions.UserifyOne(chattingWith);
                }
        }


        stateStore.set('inChatWith', chattingWith);
        stateStore.set('chatElement', workingElement);
    };

    static getUserOrGroup(object){
        if (object.members){
            return this.Groupify([object])[0];
        }
        else {
            return this.UserifyOne(object);
        }
    }

    static getChatEntity(name: string) {
        let entity;
        const users = StateStore.getInstance().get('allUsers');
        const groups = StateStore.getInstance().get('allGroups');

        entity = users.find(o => o.user_name === name);
        if (!entity){
            entity = groups.find(o => o.group_name === name);
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

        let eleChildren = MyFunctions.getElementChildren(workingElement);

        if (!eleChildren) {
            return;
        }

        for (let i=0; i<eleChildren.length; i++){

            let child = eleChildren[i];

            child.classList.toggle('isHidden');
            const innerChildHidden = MyFunctions.areElementsHidden(MyFunctions.getElementChildren(child));
            if (child.classList.contains('isHidden') && !innerChildHidden) {
                MyFunctions.decideVisibility(child);
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
        if (element.classList[4]) {
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
            liChildren = MyFunctions.getElementChildren(currentlyActive);
            liParent = MyFunctions.getElementParent(currentlyActive);
        }

        switch (event.key) {
            case 'ArrowDown':
                MyFunctions.dealWithDown(currentlyActive,liChildren,liParent);
                break;
            case 'ArrowUp':
                MyFunctions.dealWithUp(currentlyActive);
                break;
            case 'Enter':
                MyFunctions.dealWithEnter(currentlyActive, liChildren);
                break;
            case 'ArrowRight':
                MyFunctions.dealWithRight(currentlyActive, liChildren);
                break;
            case 'ArrowLeft':
                MyFunctions.dealWithLeft(currentlyActive, liChildren, liParent);
                break;
        }
    };

    static dealWithDown = (currentlyActive: any, liChildren: any, liParent: any) => {
        ///FEATURE
        //Check if there is a li to disabled if none are disabled
        const allLis = document.getElementsByTagName('li');
        const firstLi = allLis[0];
        if (!currentlyActive && firstLi){
            MyFunctions.makeActive(firstLi);
        }

        //if nothing is disabled, and no li in sight, simply go back
        if (!currentlyActive) {
            return;
        }

        let eleToActive, idNow;

        //check if its a group
        if (currentlyActive.classList.contains('group')) {
            //get its children
            liChildren = MyFunctions.getElementChildren(currentlyActive);
        }
        //if it's a child of another element, get the parent
        if (currentlyActive.classList.contains('childElement')) {
            liParent = MyFunctions.getElementParent(currentlyActive);
        }

        idNow = parseInt(currentlyActive.id);

        const lastLi = allLis[allLis.length-1];

        if (idNow === parseInt(lastLi.id)) {
            return;
        }

        //if has children and
        //those children are visible and can be moved to
        if (liChildren && !MyFunctions.areElementsHidden(liChildren)) {
            eleToActive = liChildren[0];
        }
        else {
            if(liParent){
                let parentsChildren = MyFunctions.getElementChildren(liParent);
                let lastChild = parentsChildren[parentsChildren.length - 1];
                //if i'm the last disabled child
                if (parseInt(lastChild.id) === idNow) {
                    //take my parent's id
                    idNow = parseInt(liParent.id);
                }
            }
            eleToActive = document.getElementById((idNow + 1).toString());
        }

        MyFunctions.makeActive(eleToActive);
    };

    static dealWithUp = (currentlyActive: any) => {
        let eleToActive, idNow, previousLi;

        idNow = parseInt(currentlyActive.id);

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

        MyFunctions.makeActive(eleToActive);
    };

    static dealWithLeft = (currentlyActive: any, liChildren: any, liParent: any) => {

        if (liChildren) {
            if (!MyFunctions.areElementsHidden(liChildren)) {
                MyFunctions.decideVisibility(currentlyActive);
            }
            else if (liParent) {
                if (MyFunctions.areElementsHidden(MyFunctions.getElementChildren(liParent))) {
                    MyFunctions.decideVisibility(liParent);
                }
                MyFunctions.makeActive(liParent);
            }
        }
        else if (liParent) {
            if (MyFunctions.areElementsHidden(MyFunctions.getElementChildren(liParent))) {
                MyFunctions.decideVisibility(liParent);
            }
            else {
                MyFunctions.makeActive(liParent);
            }
        }
    };

    static dealWithRight = (currentlyActive: any, liChildren: any) => {
        //if it has children
        if (liChildren.length > 0) {
            //if any of my children are hidden, i will hide myself
            if (MyFunctions.areElementsHidden(liChildren)) {
                MyFunctions.decideVisibility(currentlyActive);
            }
            //makeActive(liChildren[0]);
        }
    };

    static dealWithEnter = (currentlyActive: any, liChildren: any) => {
        //if it has children
        if (liChildren.length > 0) {
            MyFunctions.decideVisibility(currentlyActive);
        }
    };
}

export default MyFunctions;