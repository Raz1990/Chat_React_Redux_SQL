//A component for a speech bubble containing a className, content

import * as React from 'react';
import SpeechBubbleContent from './../Components/SpeechBubbleContent';
import ISpeechBubble from "../Interfaces/SpeechBubble";

interface ISpeechProps {
    SpeechBubble: ISpeechBubble,
    mine: boolean
}

class SpeechBubble extends React.Component<ISpeechProps,{}> {

    constructor(props: ISpeechProps) {
        super(props);
    }

    public determineClass() {
        let chosenClass = 'speechBubble ';

        //determine color and position (left / right)
        if (this.props.mine){
            chosenClass += 'mine ';
        }
        else{
            chosenClass += 'notMine ';
        }

        //determine language (English or not) by the first letter
        if (/^[a-zA-Z]+$/.test(this.props.SpeechBubble.content[0])) {
            chosenClass += 'English';
        } else {
            chosenClass += 'otherLanguage';
        }
        return chosenClass;
    }

    public render() {
        return (
            <div className={this.determineClass()}> <SpeechBubbleContent content={this.props.SpeechBubble.content}/> <div className={'messageTime'}>{this.props.SpeechBubble.timeSent}</div></div>
        );
    }
}

export default SpeechBubble;