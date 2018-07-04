import * as React from 'react';
import * as moment from 'moment';
import StateStore from './../State/StateStore';
import {ServerAPI} from "./../ServerAPI";

import SpeechBubbleWrapper from './SpeechBubbleWrapper';
import {User} from './../Classess/User';
import ISpeechBubble from "../Interfaces/SpeechBubble";

interface IConvoProps {
}

interface IConvoState {
    speechBubbles : ISpeechBubble[]
}

class ConversationHistoryArea extends React.Component <IConvoProps,IConvoState> {

    stateStore = StateStore.getInstance();
    currentUser: User;
    speechBlock : any;

    constructor(props: IConvoProps){
        super(props);

        this.speechBlock = React.createRef();
        this.currentUser = this.stateStore.get('currentUser');

        this.state = {
            speechBubbles : []
        };

        this.getMessages();

        StateStore.getInstance().subscribe(()=>{
            this.getMessages();
        });
    }

    getMessages(){
        if (!this.stateStore.get('inChatWith')){
            return;
        }
        ServerAPI.getMessages(this.currentUser.getName(),this.stateStore.get('inChatWith').getName(), this.stateStore.get('inChatWith').getType())
            .then((messageHistory) => {
                /*for (let msg of messageHistory) {
                    msg.sender = MyFunctions.UserifyOne(msg.sender.name);
                    msg.receiver = MyFunctions.UserifyOne(msg.receiver.name);
                }*/
                this.setState({
                    speechBubbles : messageHistory
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
                          content={bubble.content}
                          sender={bubble.sender.name}
                          receiver={bubble.receiver.name}
                          timeSent={bubble.timeSent}
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
