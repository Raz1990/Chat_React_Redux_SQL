//holds both the ConversationHistoryArea on the top and big part and MessageInputArea on the bottom and small part
import * as React from 'react';
import {store} from './../Redux/store';
import * as actions from './../Redux/actions';

//components imports
import ConversationHistoryArea from './ConversationHistoryArea';
import MessageInputArea from './MessageInputArea';

import Helpers from '../Classess/helpers';

interface IRightProps {
}

interface IRightSTATE {
}

class RightArea extends React.Component<IRightProps,IRightSTATE> {

    constructor(props: IRightProps){
        super(props);
    }

    removeActive = () => {
        Helpers.removeActive();
        store.dispatch(actions.setInChatWith(null));
    };

    public render() {
        //if in a chat with someone
        if (store.getState()['inChatWith']) {
            return (
                <div className="right">

                    <ConversationHistoryArea/>

                    <MessageInputArea/>

                </div>
            );
        }

        let noChatText = "";

        if (store.getState()['currentUser']){
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
