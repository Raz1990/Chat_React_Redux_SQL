import {User} from "./User";
import {Group} from "./Group";

class MyFunctions {
    static Userify(fakeUsers){
        let usersARR = [];
        for (const fakeUser of fakeUsers){
            usersARR.push(new User(fakeUser.id,fakeUser.user_name,fakeUser.password,fakeUser.age));
        }
        return usersARR;
    }

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
}

export default MyFunctions;