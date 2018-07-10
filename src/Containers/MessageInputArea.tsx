import * as React from 'react';
import * as moment from 'moment';
import {store} from './../Redux/store';

//components imports
import MyButton from './../Components/MyButton';
import {ServerAPI} from "../ServerAPI";
import Helpers from "../Classess/helpers";

interface IMessageInputAreaState {
    message: string
}

class MessageInputArea extends React.Component<{},IMessageInputAreaState> {

    inputRef: any;

    constructor(props: {}){
        super(props);

        this.inputRef = React.createRef();

        this.state = {
            message: ''
        };

    }

    updateMessage = (e: any) => {

        let message : string;
        message = e.target.value;

        this.setState((prevState: any, prop)=>{
            return {message: prevState.message = message};
        });
    };

    addMessageToBoard = () => {
        if (this.state.message.trimLeft() === ''){
            this.setState({
                message: ''
            });
            return;
        }

        let currentUser = store.getState()['currentUser'];
        let receiver = store.getState()['inChatWith'];
        let message = this.state.message;

        if (message === ''){
            return;
        }

        ServerAPI.addMessageToAConversation(currentUser.getId(),receiver.getId(),receiver.getType(),message,moment().format("HH:mm"))
            .then((done) => {
                this.clearMessage();
                //start an "echo" from the receiver
                const reply = Helpers.AIReply(receiver.getName());
                ServerAPI.addMessageToAConversation(receiver.getId(),currentUser.getId(),receiver.getType(),reply,moment().format("HH:mm"))
                    .then((done) => {
                        if (done) {
                            Helpers.emitTheIO('chat');
                        }
                    });
            });
    };

    addMessageViaEnter = (key : any) => {
        // if I ever implement textarea instead of input
        // if (key.shiftKey) {
        //     return;
        // }
        if (key.key === 'Enter') {
            this.addMessageToBoard();
        }
    };

    clearMessage = () => {
        this.setState({
            message: ''
        });
    };

    public render() {

        let btnClass = 'input ';
        let clickable = true;

        if (this.state.message.trimLeft() === '') {
            btnClass += 'emptyInput ';
            clickable = false;
        }
        else {
            btnClass += 'fullInput ';
            clickable = true;
        }

        return (
            <div className="InputArea">
                {/*<textarea value={this.state.message} placeholder={'הקלד הודעה כאן...'} className={'input'} onChange={this.updateMessage} ref={this.inputRef} onKeyPress={this.addMessageViaEnter} />*/}
                <input type={'text'} value={this.state.message} placeholder={'הקלד הודעה כאן...'} className={'input'} onChange={this.updateMessage} ref={this.inputRef} onKeyUp={this.addMessageViaEnter}/>
                <MyButton callbackFunc={this.addMessageToBoard} contentSTR={'Send'} className={btnClass} disabled={!clickable}/>
                <MyButton callbackFunc={this.clearMessage} contentSTR={'X'} className={btnClass} disabled={!clickable}/>
            </div>
        );
    }
}

export default MessageInputArea;