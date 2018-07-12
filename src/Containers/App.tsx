import * as React from 'react';
import {connect} from 'react-redux';
import '../App.css';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//components imports
import ChatEntitiesTree from './ChatEntitiesTree';
import RightArea from './RightArea';
import Modal from "./../Components/Modal";
import {ServerAPI} from "./../ServerAPI";
import styles from "./../Styles/styles";
import {User} from "../Classess/User";
// import {store} from './../Redux/store';
import * as actions from './../Redux/actions';
import Helpers from "../Classess/helpers";


class App extends React.Component<any,any> {
    constructor(props: any){
        super(props);

        this.state = {
            user_name: 'Raz',
            password: 'rrr'
        };
    }

    inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value })
    };

    componentDidMount() {
        Helpers.storeAllEntities();
    }

    submit = () => {
        ServerAPI.getSingleUser(this.state.user_name,this.state.password)
            .then((currentUser) => {
                //if found a user
                if (currentUser){
                    const user = new User(currentUser.id,currentUser.user_name,currentUser.password,currentUser.age);
                    alert('Welcome, ' + user.getName());
                    this.props.login(user);
                    this.setState({currentUser:user});
                }
                else {
                    alert(this.state.username + ' not found!');
                }
            });
    };

    //submit = () => this.props.submit(this.state.username, this.state.password);

    toast = () => {
        const Toasty = ({ closeToast }:any) => (
            <img src={process.env.PUBLIC_URL + '/images/toastyGuy.jpeg'}/>
        );

        toast(<Toasty />, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 400,
            pauseOnHover: false,
            hideProgressBar: true
        });

        setTimeout(() => {
            const audio: HTMLAudioElement = new Audio(process.env.PUBLIC_URL + 'sounds/toasty.wav');
            audio.play()}
            , 200);
    };

    hertzel = () => {
        setTimeout(() => {
                const audio: HTMLAudioElement = new Audio(process.env.PUBLIC_URL + 'sounds/hertzel.wav');
                audio.play();
            }
            , 630);

        const Hertzel1 = ({ closeToast }:any) => (
            <img src={process.env.PUBLIC_URL + '/images/hertzel1.gif'} style={styles.toastImg}/>
        );

        const firstDuration = 5000;

        toast(<Hertzel1 />, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: firstDuration,
            pauseOnHover: false,
            hideProgressBar: true
        });

        setTimeout(() => {
            const Hertzel2 = ({ closeToast }:any) => (
                <img src={process.env.PUBLIC_URL + '/images/hertzel2.gif'} style={styles.toastImg}/>
            );

            toast(<Hertzel2 />, {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1800,
                pauseOnHover: false,
                hideProgressBar: true,
                transition: Zoom
            });
            }
            , firstDuration);
    };

    surprise = () => {
        const Surprise = ({ closeToast }:any) => (
            <img src={process.env.PUBLIC_URL + '/images/surprise.gif'} style={styles.toastImg}/>
        );

        setTimeout(() => {
                toast(<Surprise />, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1500,
                    pauseOnHover: false,
                    hideProgressBar: true
                });}
            , 200);

        const audio: HTMLAudioElement = new Audio(process.env.PUBLIC_URL + 'sounds/surprise-motherfucker.wav');
        audio.play();
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
                    <button style={styles.button} onClick={this.hertzel}>Hertzel!</button>
                    <button style={styles.button} onClick={this.surprise}>Surprise Me!</button>
                    <button style={canSubmit ? styles.button : styles.buttonDisabled} disabled={!canSubmit} onClick={this.submit}>Login</button>
                    <button style={styles.button} onClick={this.toast}>A Toast!</button>
                </div>
            </Modal>
        );

        return (
            <div id='toor'>
                <ToastContainer />
                {!this.props.currentUser ? modal : <div/>}

                <ChatEntitiesTree/>
                <RightArea/>
            </div>
        );
    }
}

//export default App;

const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.currentUser
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        login: (user) => {
            dispatch(actions.setCurrentUser(user))
        }
    }
};

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

console.log("ConnectedApp", ConnectedApp);

export default ConnectedApp;
