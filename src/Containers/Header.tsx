import * as React from 'react';

//components imports
import StateStore from "../State/StateStore";
import {User} from "../Classess/User";
import ICanChat from "../Interfaces/ChatEntity";

interface IHeaderSTATE {
    currentUser : User
    inChatWith : ICanChat
}

interface IHeaderPROPS {
}

class Header extends React.Component<IHeaderPROPS,IHeaderSTATE> {

    listenerIndex: number;

    constructor(props: IHeaderPROPS){
        super(props);

        this.state = {
            currentUser : StateStore.getInstance().get('currentUser'),
            inChatWith : StateStore.getInstance().get('inChatWith')
        };

        this.listenerIndex = StateStore.getInstance().subscribe(()=>{
            this.setState({
                currentUser : StateStore.getInstance().get('currentUser'),
                inChatWith : StateStore.getInstance().get('inChatWith')
            });
        });
    }

    componentWillUnmount(){
        //StateStore.getInstance().unsubscribe(this.listenerIndex);
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
