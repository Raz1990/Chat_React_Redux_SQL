//A component for a speech bubble containing a className, content

import * as React from 'react';

interface ISpeechBubblePROPS {
    content: string
}

class SpeechBubbleContent extends React.Component<ISpeechBubblePROPS,{}> {
    constructor(props: ISpeechBubblePROPS) {
        super(props)
    }

    public determineClass() {
        let chosenClass = '';

        return chosenClass;
    }

    public render() {
        //if its an image
        if ((/\.(gif|jpe?g|tiff|png|jfif)$/i).test(this.props.content)) {
            let imgSrc = process.env.PUBLIC_URL + '/images/'+this.props.content;
            return (
                <img src={imgSrc}/>
            );
        }
        else if ((/\.(co|com|uk)$/i).test(this.props.content)){
            let link = this.props.content;
            //if it misses the www initial, add it
            if ((/^(www)$/i).test(this.props.content)) {
                link = 'www.'+link;
            }
            //finally, add https
            link = 'https://'+ link;
            return (
                <a href={link} target={'_blank'}>{this.props.content}</a>
            );
        }
        //otherwise, just plain text
        else {
            return (
                <span className={this.determineClass()}>{this.props.content}</span>
            );
        }
    }
}

export default SpeechBubbleContent;