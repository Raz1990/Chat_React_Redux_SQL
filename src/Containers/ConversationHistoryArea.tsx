import * as React from 'react';
import * as moment from 'moment';
import {ServerAPI} from "./../ServerAPI";
import {store} from './../Redux/store';

import SpeechBubbleWrapper from './SpeechBubbleWrapper';
import {User} from './../Classess/User';
import ISpeechBubble from "../Interfaces/SpeechBubble";
import ICanChat from "../Interfaces/ChatEntity";
import Helpers from "../Classess/helpers";

interface IConvoProps {
}

interface IConvoState {
    speechBubbles : ISpeechBubble[]
}

class ConversationHistoryArea extends React.Component <IConvoProps,IConvoState> {

    speechBlock : any;

    constructor(props: IConvoProps){
        super(props);

        this.speechBlock = React.createRef();

        this.state = {
            speechBubbles : []
        };

        this.getMessages();

        store.subscribe(() => {
            this.getMessages()
        });

    }

    getMessages(){
        if (!store.getState()['inChatWith']){
            return;
        }
        ServerAPI.getMessages(store.getState()['currentUser'].getId(),store.getState()['inChatWith'].getId(),store.getState()['inChatWith'].getType())
            .then((messageHistory) => {
                ServerAPI.getMessages(store.getState()['inChatWith'].getId(),store.getState()['currentUser'].getId(),store.getState()['inChatWith'].getType())
                    .then((otherSideMessageHistory) => {
                        let fixedMessages = messageHistory.map( msg => {
                            let sender : User = store.getState()['allUsers'].find(u => u.getId() === msg.sender_id);
                            let receiver : ICanChat = store.getState()['allUsers'].find(u => u.getId() === msg.receiver_id);
                            let content = msg.content;
                            if (!receiver){
                                receiver = store.getState()['allGroups'].find(g => g.getId() === msg.receiver_id);
                                content = sender.getName() + ": " + content;
                            }
                            return {
                                id:msg.id,
                                sender:sender.getName(),
                                receiver:receiver.getName(),
                                timeSent:msg.time,
                                content:content
                            };
                        });
                        fixedMessages = fixedMessages.concat(otherSideMessageHistory.map( msg => {
                            let sender : User = store.getState()['allUsers'].find(u => u.getId() === msg.sender_id);
                            let receiver : ICanChat = store.getState()['allUsers'].find(u => u.getId() === msg.receiver_id);
                            let content = msg.content;
                            if (!receiver){
                                receiver = store.getState()['allGroups'].find(g => g.getId() === msg.receiver_id);
                                content = sender.getName() + ": " + content;
                            }
                            return {
                                id:msg.id,
                                sender:sender.getName(),
                                receiver:receiver.getName(),
                                timeSent:msg.time,
                                content:content
                            };
                        }));
                        fixedMessages.sort(Helpers.compare);
                        this.setState({
                            speechBubbles : fixedMessages
                        });
                    });


                let fixedMessages = messageHistory.map( msg => {
                    let sender : User = store.getState()['allUsers'].find(u => u.getId() === msg.sender_id);
                    let receiver : ICanChat = store.getState()['allUsers'].find(u => u.getId() === msg.receiver_id);
                    let content = msg.content;
                    if (!receiver){
                        receiver = store.getState()['allGroups'].find(g => g.getId() === msg.receiver_id);
                        content = sender.getName() + ": " + content;
                    }
                    return {sender:sender.getName(),
                            receiver:receiver.getName(),
                            timeSent:msg.time,
                            content:content
                            };
                });
                this.setState({
                    speechBubbles : fixedMessages
                });
            });
    }

    componentDidMount() {
        this.speechBlock.current.scrollTop = this.speechBlock.current.scrollHeight;
    }

    componentDidUpdate() {
        this.speechBlock.current.scrollTop = this.speechBlock.current.scrollHeight;
    }


    public render() {

        let bubbles = this.state.speechBubbles.map((bubble:any, idx) =>
            (
                <SpeechBubbleWrapper
                    key={idx}
                    SpeechBubble={bubble}
                />
            )
            );

        let h4Text;

        if (bubbles.length < 1) {
            h4Text = 'אין בושה - החל שיחה';
        }
        else {
            h4Text = moment().format('MMMM Do YYYY');
        }

        return (
            <div className="content" ref={this.speechBlock}>
                <h4 className={'dayHeadLine'}> {h4Text} </h4>
                {bubbles}
            </div>
        );
    }
}

export default ConversationHistoryArea;
