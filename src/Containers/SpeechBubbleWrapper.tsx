//A component for wrapping a speech bubble

import * as React from 'react';
import {store} from './../Redux/store';
import SpeechBubble from './../Components/SpeechBubble';
import ISpeechBubble from "./../Interfaces/SpeechBubble";

interface ISpeechWrapperProps {
    SpeechBubble: ISpeechBubble
}

class SpeechBubbleWrapper extends React.Component<ISpeechWrapperProps,{}> {

    mine = true;

    constructor(props: ISpeechWrapperProps) {
        super(props);
    }

    public determineClass() {
        let chosenClass = 'speechWrapper ';
        //if the sender of the message is the same as the user who is logged in
        if (store.getState()['currentUser'].getName() != this.props.SpeechBubble.sender) {
            chosenClass += 'wrapperNotMySpeech';
            this.mine = false;
        }
        return chosenClass;
    }

    public render() {
        return (
            <div className={this.determineClass()}>
            <SpeechBubble
                SpeechBubble={this.props.SpeechBubble}
                mine={this.mine}
            />
            </div>
        );
    }
}

export default SpeechBubbleWrapper;