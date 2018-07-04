import * as React from 'react';

import Modal from "./../Components/Modal";
import IUser from "../Interfaces/IUser";
import IGroup from "../Interfaces/IGroup";

interface IAddProps {
    styles;
    submitCallback;
    cancelCallback;
    AddTypes;
}

interface IAddState {
    selectedType: string,
    user_name : string,
    password : string,
    age : string,
    group_name : string,
    canSubmit : boolean
}

class AddingPanel extends React.Component<IAddProps,IAddState> {

    constructor(props: IAddProps){
        super(props);

        this.state = {
            selectedType: 'user',
            user_name : 'lola',
            password : 'lol',
            age : '80',
            group_name : '',
            canSubmit : false
        };
    }

    inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let value = event.target.value;

        if(name === 'user_name')
            this.setState({
                user_name: value,
                canSubmit: (value !== ''  && this.state.password !== '' && this.state.age !== '')
            });
        else if(name === 'password')
            this.setState({
                password: value,
                canSubmit: (this.state.user_name !== ''  && value !== '' && this.state.age !== '')
            });
        else if(name === 'age') {
            if (parseInt(value) > 120)
                value = '120';
            else if (parseInt(value) <= 0)
                return;
            this.setState({
                age: value,
                canSubmit: (this.state.user_name !== '' && this.state.password !== '' && value !== '')
            });
        }
        else if(name === 'group_name')
            this.setState({
                group_name: value,
                canSubmit: value !== ''
            });
    };

    SelectedChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selectedType: event.target.value,
            user_name : '',
            password : '',
            age : '',
            group_name : '',
            canSubmit : false
        });
    };

    AddInteraction(){
        if(this.state.selectedType === 'user'){
            return (
                <div>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="user_name">Name</label>
                        <input style={this.props.styles.input} type="text" name="user_name" value={this.state.user_name} onChange={this.inputChangedHandler} />
                    </p>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="password">Password</label>
                        <input style={this.props.styles.input} type="password" name="password" value={this.state.password} onChange={this.inputChangedHandler} />
                    </p>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="age">Age</label>
                        <input style={this.props.styles.input} type="number" min="1" max="100" name="age" value={this.state.age} onChange={this.inputChangedHandler} />
                    </p>
                </div>
            );
        }
        else {
            return (
                <div>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="group_name">Name</label>
                        <input style={this.props.styles.input} type="text" name="group_name" value={this.state.group_name} onChange={this.inputChangedHandler} />
                    </p>
                </div>
            );
        }
    }

    add = () => {
        const type = this.state.selectedType;
        let objectToSend : IUser | IGroup;

        if(type === 'user'){
            objectToSend = {user_name: this.state.user_name, password: this.state.password, age: parseInt(this.state.age)};
        }
        else if(type === 'group') {
            objectToSend = {group_name: this.state.group_name, parent:null};
        }

        this.props.submitCallback(objectToSend, type);
    };

    public render() {

        const canSubmit = this.state.canSubmit;

        const AddTypes = this.props.AddTypes.map((item, idx) => {
            return (<option key={idx} value={item}>{item}</option>);
        });

        const divSelected = this.AddInteraction();

        return (
            <Modal style={this.props.styles.modal}>
                <div style={this.props.styles.divOfType}>
                    <span style={this.props.styles.p}>
                        <label style={this.props.styles.input} htmlFor="AddType">What would you like to add?</label>
                        <select style={this.props.styles.input} name="AddType" onChange={this.SelectedChangedHandler}>
                            {AddTypes}
                        </select>
                    </span>
                </div>
                {divSelected}
                <div className={"buttonsWrapper"}>
                    <button style={canSubmit ? this.props.styles.button : this.props.styles.buttonDisabled} disabled={!canSubmit} onClick={this.add}>Add</button>
                    <button style={this.props.styles.cancelButton} onClick={this.props.cancelCallback}>Cancel</button>
                </div>
            </Modal>
        )
    }
}

export default AddingPanel;
