//holds both the ConversationHistoryArea on the top and big part and MessageInputArea on the bottom and small part
import * as React from 'react';
import {store} from './../Redux/store';
import * as actions from './../Redux/actions';

//components imports
import ConversationHistoryArea from './ConversationHistoryArea';
import MessageInputArea from './MessageInputArea';
import {User} from './../Classess/User';
import ICanChat from "./../Interfaces/ChatEntity";

import Helpers from '../Classess/helpers';

interface IRightProps {
}

interface IRightSTATE {
    currentUser : User
    inChatWith : ICanChat | null
}

class RightArea extends React.Component<IRightProps,IRightSTATE> {

    constructor(props: IRightProps){
        super(props);

        this.state = {
            currentUser : store.getState()['currentUser'],
            inChatWith: store.getState()['inChatWith'],
        };

        store.subscribe(() => {
            this.setState({
                currentUser : store.getState()['currentUser'],
                inChatWith: store.getState()['inChatWith']
            });
        })
    }

    removeActive = () => {
        Helpers.removeActive();
        store.dispatch(actions.setInChatWith(null));
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
