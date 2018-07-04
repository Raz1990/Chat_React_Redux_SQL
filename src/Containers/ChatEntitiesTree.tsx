//is positioned on the left part of the screen, showing every group and user entities

import * as React from 'react';

import Header from './Header';
import StateStore from "../State/StateStore";
import ICanChat from "../Interfaces/ChatEntity";
import MyFunctions from '../Classess/helpers';
import {User} from './../Classess/User';
import {Group} from "../Classess/Group";
import AdminPanel from './AdminPanel';

interface ITreeState {
    currentUser : User;
    entities: ICanChat[];
}

interface ITreeProps {
}

class ChatEntitiesTree extends React.Component<ITreeProps,ITreeState> {

    ulTree: any;
    dumbEntities;

    constructor(props: ITreeProps){
        super(props);

        this.ulTree = React.createRef();

        this.state = {
            currentUser : StateStore.getInstance().get('currentUser'),
            entities : this.getEntities()
        };

        StateStore.getInstance().subscribe(()=>{
            this.setState({
                currentUser : StateStore.getInstance().get('currentUser'),
                entities : this.getEntities()
            });
        });
    }

    getEntities(){
        let dumbEntities = StateStore.getInstance().get('allEntities');
        let smartEntities = [];
        if (!dumbEntities) return [];
        for (let entity of dumbEntities){
            //if it has members = it is a group
            if (entity.members){
                smartEntities.push(...MyFunctions.Groupify([entity]));
            }
            else {
                smartEntities.push(MyFunctions.UserifyOne(entity));
            }
        }
        return smartEntities;
    }

    singleLiCreate(item : ICanChat, idValue? : number, childElement? : any, parentLiClassName? : string, repeatSpaces? : number, chatable?: boolean){

        childElement = childElement || false;

        idValue = idValue || 1;

        parentLiClassName = parentLiClassName || "";

        repeatSpaces = repeatSpaces || 0;

        const itemNameForClass = item.getName().replace(' ', '_');
        let li = {
            innerHTML: '',
            className : '',
            id : '',
            style: {}
        };
        li.innerHTML = item.getName();
        li.className += item.getType() + ' ' + itemNameForClass + ' ';
        li.id = idValue.toString();
        li.style = { 'textIndent' : repeatSpaces +'em'};

        if (childElement) {
            li.className += 'childElement childOf_' + parentLiClassName + ' isHidden ';
        }

        if (!chatable){
            li.className += 'noChat ';
        }

        return li;

    }

    createListItems(items : ICanChat[], liList? : any[], repeatSpaces? : number, idValue? : number, child? : boolean, parentLiClassName? : string){

        liList = liList || [];

        child = child || false;

        repeatSpaces = repeatSpaces || 0;

        idValue = idValue || 1;

        for (let item of items) {

            let chatable = true;

            if (item.getType() === 'group'){
                const group_item = item as Group;
                const is_child = group_item.isChild();
                if (is_child && (idValue >= 1 && idValue < items.length)){
                    continue;
                }

                if (item.getItems().length > 0) {
                    //if the group holds a group, it must mean it holds groups only, and no users, thus it cannot be chattaed with
                    if(item.getItems()[0].getType() === 'group') {
                        chatable = false;
                    }
                }
            }

            liList.push(this.singleLiCreate(item, idValue, child, parentLiClassName, repeatSpaces, chatable));

            //if it's a group with items in it
            if (item.getItems().length > 0) {
                this.createListItems(item.getItems(), liList,repeatSpaces + 1, items.length + idValue, true, item.getName().replace(' ', '_'));
            }

            idValue++;
        }


        liList = liList.map((item, idx) => {
            return <li style={item.style} onClick={MyFunctions.makeActive} onDoubleClick={MyFunctions.decideVisibility} className={item.className} id={item.id} key={idx}> {item.innerHTML} </li>;
        });

        return liList;
    }

    componentDidMount() {
        MyFunctions.setUpKeysEvents(this.ulTree.current);
    }

    public render() {

        let entitiesTree = [];
        let adminPanel = <div/>;
        if (this.state.currentUser){
            entitiesTree = this.createListItems(this.state.entities);
            adminPanel = <AdminPanel/>;
        }

        return (
            <div className={'left'}>

                <Header/>

                <ul className="tree" tabIndex={0} ref={this.ulTree}>

                    {entitiesTree}

                </ul>

                {adminPanel}

            </div>
        );
    }
}

export default ChatEntitiesTree;
