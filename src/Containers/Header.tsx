import * as React from 'react';

//components imports
import {User} from "../Classess/User";
import ICanChat from "../Interfaces/ChatEntity";
import {store} from './../Redux/store';

interface IHeaderSTATE {
    currentUser : User
    inChatWith : ICanChat
}

interface IHeaderPROPS {
}

class Header extends React.Component<IHeaderPROPS,IHeaderSTATE> {

    constructor(props: IHeaderPROPS){
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

    public render() {

        let text = "";

        if (this.state.currentUser){
            text = this.state.currentUser.getName();
        }

        if (this.state.inChatWith) {
            if ( this.state.inChatWith.getType() == 'user' ) {
                text += ' chatting with ';
            }
            else {
                text += ' chatting in group ';
            }
            text += this.state.inChatWith.getName();
        }

        return (
            <div className="header">

                <h3> {text} </h3>

            </div>
        );
    }
}

export default Header;
