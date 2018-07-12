import * as React from 'react';

//components imports
import {store} from './../Redux/store';

interface IHeaderSTATE {
}

interface IHeaderPROPS {
}

class Header extends React.Component<IHeaderPROPS,IHeaderSTATE> {

    constructor(props: IHeaderPROPS){
        super(props);
    }

    public render() {

        let text = "";

        if (store.getState()['currentUser']){
            text = store.getState()['currentUser'].getName();
        }

        if (store.getState()['inChatWith']) {
            if (store.getState()['inChatWith'].getType() === 'user' ) {
                text += ' chatting with ';
            }
            else {
                text += ' chatting in group ';
            }
            text += store.getState()['inChatWith'].getName();
        }

        return (
            <div className="header">

                <h3> {text} </h3>

            </div>
        );
    }
}

export default Header;
