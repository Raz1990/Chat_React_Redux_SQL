//is positioned on the left part of the screen, showing every group and user entities

import * as React from 'react';

import Header from './Header';
import ICanChat from "../Interfaces/ChatEntity";
import Helpers from '../Classess/helpers';
import {Group} from "../Classess/Group";
import AdminPanel from './AdminPanel';
import {store} from './../Redux/store';

interface ITreeState {
    entities: ICanChat[]
}

interface ITreeProps {
}

class ChatEntitiesTree extends React.Component<ITreeProps,ITreeState> {

    ulTree: any;

    constructor(props: ITreeProps){
        super(props);

        this.ulTree = React.createRef();

        this.state = {
            entities: store.getState()['allEntities']
        };

        store.subscribe( () => {
            this.setState({entities: store.getState()['allEntities']});
        });
    }

    singleLiCreate(item : ICanChat, orderIdValue? : number, childElement? : any, parentLiClassName?: string, repeatSpaces? : number, chatable?: boolean){

        childElement = childElement || false;

        orderIdValue = orderIdValue || 1;

        repeatSpaces = repeatSpaces || 0;

        parentLiClassName = parentLiClassName || "";

        const itemNameForClass = item.getName().replace(' ', '_');
        let li = {
            innerHTML: '',
            className : '',
            id : '',
            orderId : '',
            style: {}
        };
        li.innerHTML = item.getName();
        li.className += item.getType() + ' ' + itemNameForClass + ' ';
        li.id = item.getId().toString();
        li.orderId = orderIdValue.toString();
        li.style = { 'textIndent' : repeatSpaces +'em'};

        if (childElement) {
            li.className += 'childElement childOf_' + parentLiClassName + ' isHidden ';
        }

        if (!chatable){
            li.className += 'noChat ';
        }

        return li;

    }

    createListItems(items : ICanChat[], liList? : any[], repeatSpaces? : number, orderIdValue? : number, skipItem?:boolean, parentLiClassName? : string){

        liList = liList || [];

        repeatSpaces = repeatSpaces || 0;

        orderIdValue = orderIdValue || 1;

        let is_child, chatable;

        if (skipItem === undefined){
            skipItem = true;
        }

        for (let item of items) {
            chatable = true;
            is_child = false;

            if (item.getType() === 'group'){
                const group_item = item as Group;
                is_child = group_item.isChild();
                if (is_child){
                    if (skipItem){
                        continue;
                    }
                    parentLiClassName = group_item.getParentGroup().getName().replace(' ', '_');
                }
                //if at least one of the members is a group, it means the group cannot
                //hold users, and thus rendered unchatable.
                const first_member_of_group = group_item.getGroupMembers()[0];
                if (first_member_of_group){
                    if (first_member_of_group.getType() === 'group') {
                        chatable = false;
                    }
                }
            }
            //else, its a user
            //and if we wanted to skip showing the item, we'll also skip showing the users
            else if (!skipItem){
                is_child = true;
            }

            liList.push(this.singleLiCreate(item, orderIdValue, is_child, parentLiClassName, repeatSpaces, chatable));

            //if it's a group with items in it
            if (item.getItems().length > 0) {
                this.createListItems(item.getItems(), liList,repeatSpaces + 1, items.length + orderIdValue, false, item.getName().replace(' ', '_'));
            }

            orderIdValue++;
        }


        liList = liList.map((item, idx) => {
            return <li style={item.style} onClick={Helpers.makeActive} onDoubleClick={Helpers.decideVisibility} className={item.className} id={item.id} data-orderid={item.orderId} key={idx}> {item.innerHTML} </li>;
        });

        return liList;
    }

    componentDidMount() {
        Helpers.setUpKeysEvents(this.ulTree.current);
    }

    public render() {

        let entitiesTree = [];
        let adminPanel = <div/>;
        if (store.getState()['currentUser']){
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
