import * as React from 'react';

import Modal from "./../Components/Modal";

interface IUpdateProps {
    styles;
    submitCallback;
    cancelCallback;
    updateObject;
    groups;
    users;
}

interface IUpdateState {
    selectedAction: string,
    user_name : string,
    password : string,
    age : string,
    group_name : string,
    canSubmit : boolean,
    movingGroupId: number,
    input: string,
    addedUserId: number,
    removedUserId: number
}

class UpdatingPanel extends React.Component<IUpdateProps,IUpdateState> {

    objectType = this.props.updateObject.getType();

    constructor(props: IUpdateProps) {
        super(props);

        let password ="";
        let age = "";

        if (this.objectType === 'user') {
            password = this.props.updateObject.getPassword();
            age = this.props.updateObject.getAge();
        }
        this.state = {
            selectedAction: "1",
            user_name : this.props.updateObject.getName(),
            password : password,
            age : age,
            group_name : this.props.updateObject.getName(),
            canSubmit : true,
            movingGroupId : 0,
            addedUserId : 0,
            removedUserId: 0,
            input: ""
        };
    }

    inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        let input : string;
        input = event.target.value;

        this.setState({
            input: input
        });

        let name = event.target.name;
        let value = event.target.value;

        if(name === 'password')
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
            selectedAction: event.target.value,
            user_name : '',
            password : '',
            age : '',
            group_name : this.props.updateObject.getName(),
            canSubmit : true
        });
    };

    //moving another group to selected group
    SelectedGroupMovingHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(event.target.selectedOptions[0].id);
        this.setState({
            movingGroupId: id
        });
    };

    SelectedUserToAddHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(event.target.selectedOptions[0].id);
        this.setState({
            addedUserId: id
        });
    };

    SelectedUserToDeleteHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(event.target.selectedOptions[0].id);
        this.setState({
            removedUserId: id
        });
    };

    getEligibleGroups = () => {
        let okGroups = [];
        let shouldContinue = false;

        for (const group of this.props.groups) {
            if (group.getId() === this.props.updateObject.getId()) {
                continue;
            }
            if (this.props.updateObject.getParentGroup()) {
                if (group.getId() === this.props.updateObject.getParentGroup().getId()) {
                    continue;
                }
            }
            for (const groupMember of this.props.updateObject.getGroupMembers()) {
                if (group.getId() === groupMember.getId()) {
                    shouldContinue = true;
                    break;
                }
            }
            if (shouldContinue) {
                shouldContinue = false;
                continue;
            }

            okGroups.push(group);
        }

        return okGroups;
    };

    groupHasGroups = () => {
        for (const member of this.props.updateObject.getGroupMembers()) {
            if (member.getType() === 'group') {
                return true;
            }
        }
        return false;
    };

    getEligibleUsers = () => {
        let okUsers = [];

        for (const user of this.props.users) {
            if (this.props.updateObject.getGroupMembers().find(o => o.getId() === user.getId())){
                continue;
            }
            okUsers.push(user);
        }

        return okUsers;
    };

    AddInteraction(){
        let interaction;
        if (this.objectType === 'group'){
            if (this.state.selectedAction === "1") {
                interaction = (
                    <div>
                        <p style={this.props.styles.p}>
                            <label style={this.props.styles.label} htmlFor="group_name">Name</label>
                            <input style={this.props.styles.input} type="text" name="group_name" value={this.state.group_name} onChange={this.inputChangedHandler} />
                        </p>
                    </div>
                );
            }
            else if (this.state.selectedAction === "4"){

                let okUsers = this.getEligibleUsers();

                okUsers = okUsers.map((item, idx) => {
                    return (<option key={idx} id={item.getId()} value={item.user_name}>{item.user_name}</option>);
                });

                interaction = (
                    <div>
                        <p style={this.props.styles.p}>
                            <label style={this.props.styles.label} htmlFor="group_name">{this.props.updateObject.getName()}</label>
                        </p>
                        <select style={this.props.styles.input} name="UpdateType" onChange={this.SelectedUserToAddHandler}>
                            {okUsers}
                        </select>
                    </div>
                );
            }
            else if (this.state.selectedAction === "5"){

                let okUsers = this.props.updateObject.getGroupMembers();

                okUsers = okUsers.map((item, idx) => {
                    return (<option key={idx} id={item.getId()} value={item.user_name}>{item.user_name}</option>);
                });

                interaction = (
                    <div>
                        <p style={this.props.styles.p}>
                            <label style={this.props.styles.label} htmlFor="group_name">{this.props.updateObject.getName()}</label>
                        </p>
                        <select style={this.props.styles.input} name="UpdateType" onChange={this.SelectedUserToDeleteHandler}>
                            {okUsers}
                        </select>
                    </div>
                );
            }
            else {
                let okGroups = this.getEligibleGroups();
                okGroups = okGroups.map((item, idx) => {
                    return (<option key={idx} id={item.getId()} value={item.group_name}>{item.group_name}</option>);
                });

                interaction = (
                    <div>
                        <p style={this.props.styles.p}>
                            <label style={this.props.styles.label} htmlFor="group_name">{this.props.updateObject.getName()}</label>
                        </p>
                        <select style={this.props.styles.input} name="UpdateType" onChange={this.SelectedGroupMovingHandler}>
                            {okGroups}
                        </select>
                    </div>
                );
            }
        }
        else {
            if (this.state.selectedAction == '1'){
                interaction = (
                    <div>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="user_name">{this.props.updateObject.getName()}</label>
                    </p>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="password">Password</label>
                        <input style={this.props.styles.input} type="text" value={this.state.password} name="password" onChange={this.inputChangedHandler} />
                    </p>
                    <p style={this.props.styles.p}>
                        <label style={this.props.styles.label} htmlFor="age">Age</label>
                        <input style={this.props.styles.input} type="number" value={this.state.age} min="1" max="100" name="age" onChange={this.inputChangedHandler} />
                    </p>
                </div>
                );
            }
        }

        return interaction;
    }

    update = () => {
        let objectToSend;
        let movingGroupId;
        let addedUserId;
        let removedUserId;

        if (this.objectType === 'group'){
            switch (this.state.selectedAction) {
                case "1":
                    objectToSend = {
                        id: this.props.updateObject.getId(),
                        group_name: this.state.group_name,
                        original_group_name:this.props.updateObject.getName(),
                        action: "updateName"
                    };
                    break;
                case "2":
                    if (!this.state.movingGroupId) {
                        movingGroupId = this.getEligibleGroups()[0].getId();
                    }
                    else {
                        movingGroupId = this.state.movingGroupId;
                    }
                    objectToSend = {
                        id: this.props.updateObject.getId(),
                        group_name: this.state.group_name,
                        action: "addGroupToMe",
                        movingGroupId: movingGroupId,
                        whoParent:this.props.updateObject.getId()
                    };
                    break;
                case "3":
                    if (!this.state.movingGroupId) {
                        movingGroupId = this.getEligibleGroups()[0].getId();
                    }
                    else {
                        movingGroupId = this.state.movingGroupId;
                    }
                    objectToSend = {
                        id: this.props.updateObject.getId(),
                        group_name: this.state.group_name,
                        action: "moveMeToGroup",
                        movingGroupId: this.props.updateObject.getId(),
                        whoParent: movingGroupId
                    };
                    break;
                case "4":
                    if (!this.state.addedUserId) {
                        addedUserId = this.getEligibleUsers()[0].getId();
                    }
                    else {
                        addedUserId = this.state.addedUserId;
                    }
                    objectToSend = {
                        id: this.props.updateObject.getId(),
                        group_name: this.state.group_name,
                        action: "addUserToMe",
                        addedUserId: addedUserId
                    };
                    break;
                case "5":
                    if (!this.state.removedUserId) {
                        removedUserId = this.props.updateObject.getGroupMembers()[0].getId();
                    }
                    else {
                        removedUserId = this.state.removedUserId;
                    }
                    objectToSend = {
                        id: this.props.updateObject.getId(),
                        group_name: this.state.group_name,
                        action: "removeUserFromMe",
                        removedUserId: removedUserId
                    };
                    break;
            }
        }
        else {
            if (this.state.selectedAction == '1'){
                objectToSend = {id: this.props.updateObject.getId() ,user_name: this.state.user_name, password: this.state.password, age: parseInt(this.state.age)};
            }
        }

        this.props.submitCallback(objectToSend, this.objectType);
    };

    public render() {
        const canSubmit = this.state.canSubmit;

        let updateOptions = [];
        if (this.objectType === 'group'){
            updateOptions = [{id:1, action:"update name"}, {id:2, action:`add existing group to ${this.props.updateObject.getName()}`}, {id:3, action:`move ${this.props.updateObject.getName()} to another group`}];
            if (!this.groupHasGroups()){
                updateOptions.push({id:4, action:`add a user to ${this.props.updateObject.getName()}`});
                if (this.props.updateObject.getGroupMembers().length > 0){
                    updateOptions.push({id:5, action:`remove a user from ${this.props.updateObject.getName()}`});
                }
            }
        }
        else {
            updateOptions.push({id:1, action:"update password/age"});
        }
        const updateTypes = updateOptions.map((item, idx) => {
            return (<option key={idx} value={item.id}>{item.action}</option>);
        });

        const divSelected = this.AddInteraction();

        return (
            <Modal style={this.props.styles.modal}>
                <div style={this.props.styles.divOfType}>
                    <span style={this.props.styles.p}>
                        <label style={this.props.styles.input} htmlFor="UpdateType">What would you like to change?</label>
                        <select style={this.props.styles.input} name="UpdateType" onChange={this.SelectedChangedHandler}>
                            {updateTypes}
                        </select>
                    </span>
                </div>
                {divSelected}
                <div className={"buttonsWrapper"}>
                    <button style={canSubmit ? this.props.styles.button : this.props.styles.buttonDisabled} disabled={!canSubmit} onClick={this.update}>Accept</button>
                    <button style={this.props.styles.cancelButton} onClick={this.props.cancelCallback}>Cancel</button>
                </div>
            </Modal>
        )
    }
}

export default UpdatingPanel;
