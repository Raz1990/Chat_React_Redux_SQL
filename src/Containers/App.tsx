import * as React from 'react';
import '../App.css';

//components imports
import ChatEntitiesTree from './ChatEntitiesTree';
import RightArea from './RightArea';
import StateStore from "./../State/StateStore";
import Modal from "./../Components/Modal";
import {ServerAPI} from "./../ServerAPI";
import MyFunctions from '../Classess/helpers';
import styles from "./../Styles/styles"

interface IAppProps {

}

class App extends React.Component<IAppProps,any> {

    constructor(props: IAppProps){
        super(props);

        this.state = {
            currentUser: null,
            username: 'Raz',
            password: 'rrr'
        };
    }

    inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value })
    };

    submit = () => {
        ServerAPI.getSingleUser(this.state.username,this.state.password)
            .then((currentUser) => {
                //if found a user
                if (currentUser){
                    currentUser = MyFunctions.UserifyOne(currentUser);
                    alert('Welcome, ' + currentUser.getName());
                    this.setState({currentUser:currentUser});
                    StateStore.getInstance().set('currentUser', currentUser);
                }
                else {
                    alert('User not found!');
                }
            });
    };

    escape = () => {
      alert("There is no escape...");
    };

    public render() {
        const canSubmit = !!this.state.username && !!this.state.password;
        const modal = (
            <Modal style={styles.modal}>
                <p style={styles.p}>
                    <label style={styles.label} htmlFor="username">Username</label>
                    <input style={styles.input} type="text" name="username" value={this.state.username} onChange={this.inputChangedHandler} />
                </p>
                <p>
                    <label style={styles.label} htmlFor="password">Password</label>
                    <input style={styles.input} type="password" name="password" value={this.state.password} onChange={this.inputChangedHandler} />
                </p>
                <div style={styles.div}>
                    <button style={canSubmit ? styles.button : styles.buttonDisabled} disabled={!canSubmit} onClick={this.submit}>Login</button>
                    <button style={canSubmit ? styles.button : styles.buttonDisabled} disabled={!canSubmit} onClick={this.escape}>Escape</button>
                </div>
            </Modal>
        );

        return (
            <div id='toor'>

                {!this.state.currentUser ? modal : <div/>}

                <ChatEntitiesTree/>
                <RightArea/>
            </div>
        );
    }
}

export default App;
