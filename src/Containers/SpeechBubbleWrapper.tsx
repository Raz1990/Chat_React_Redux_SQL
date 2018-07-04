//A component for wrapping a speech bubble

import * as React from 'react';
import SpeechBubble from './../Components/SpeechBubble';
import {User} from './../Classess/User';
import StateStore from "../State/StateStore";
import ISpeechBubble from "./../Interfaces/SpeechBubble";

class SpeechBubbleWrapper extends React.Component<ISpeechBubble,{}> {

    currentUser : User;

    constructor(props: ISpeechBubble) {
        super(props);

        this.currentUser = StateStore.getInstance().get('currentUser');
    }

    public determineClass() {
        let chosenClass = 'speechWrapper ';
        //if the sender of the message is the same as the user who is logged in
        if (this.currentUser.getName() != this.props.sender) {
            chosenClass += 'wrapperNotMySpeech';
        }
        return chosenClass;
    }

    public render() {
        return (
            <div className={this.determineClass()}>
            <SpeechBubble
                content={this.props.content}
                sender={this.props.sender}
                receiver={this.props.receiver}
                timeSent={this.props.timeSent}
            />
            </div>
        );
    }
}

export default SpeechBubbleWrapper;