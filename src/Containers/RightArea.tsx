//holds both the ConversationHistoryArea on the top and big part and MessageInputArea on the bottom and small part

import * as React from 'react';

//components imports
import ConversationHistoryArea from './ConversationHistoryArea';
import MessageInputArea from './MessageInputArea';
import {User} from './../Classess/User';
import StateStore from "../State/StateStore";
import ICanChat from "./../Interfaces/ChatEntity";

import MyFunctions from '../Classess/helpers';

interface IRightProps {
}

interface IRightSTATE {
    currentUser : User
    inChatWith : ICanChat | null
}

class RightArea extends React.Component<IRightProps,IRightSTATE> {

    listenerIndex: number;

    constructor(props: IRightProps){
        super(props);

        this.state = {
            currentUser : StateStore.getInstance().get('currentUser'),
            inChatWith: StateStore.getInstance().get('inChatWith'),
        };

        this.listenerIndex = StateStore.getInstance().subscribe(()=>{
            this.setState({
                currentUser : StateStore.getInstance().get('currentUser'),
                inChatWith : StateStore.getInstance().get('inChatWith')
            });
        });
    }

    componentWillUnmount(){
        StateStore.getInstance().unsubscribe(this.listenerIndex);
    }

    removeActive = () => {
        MyFunctions.removeActive();

        this.setState({
            inChatWith : null
        });
    };

    public render() {

        //if in a chat with someone
        if (this.state.inChatWith) {
            return (
                <div className="right">

                    <ConversationHistoryArea/>

                    <MessageInputArea/>

                </div>
            );
        }

        let noChatText = "";

        if (this.state.currentUser){
            noChatText = "Select someone to start a chat!";
        }

        //if not chatting with anyone
        return  (
                <div className="right">
                <h1 className="RightArea-h1"> {noChatText} </h1>
                </div>
        );
    }
}

export default RightArea;
