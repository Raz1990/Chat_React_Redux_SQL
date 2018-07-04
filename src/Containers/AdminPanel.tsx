import * as React from 'react';

import MyButton from "../Components/MyButton";
import AddingPanel from "../Components/AddingPanel";
import DeletingPanel from "../Components/DeletingPanel";
import UpdatingPanel from "../Components/UpdatingPanel";
import styles from "./../Styles/styles";
import {ServerAPI} from "../ServerAPI";
import StateStore from "../State/StateStore";
import MyFunctions from "../Classess/helpers";

interface IPanelState {
    panel: string
    disabled: boolean
}

interface IPanelProps {
}

class AdminPanel extends React.Component<IPanelProps,IPanelState> {

    constructor(props: IPanelProps){
        super(props);

        let disabled = true;

        if (StateStore.getInstance().get('chatElement')) {
            disabled = false;
        }

        this.state = {
            panel: "",
            disabled: disabled
        };

        StateStore.getInstance().subscribe(()=>{

            let disabled = true;

            if (StateStore.getInstance().get('chatElement')) {
                disabled = false;
            }

            this.setState({
                disabled : disabled
            });
        });

    }

    toggleModal = (panel) => {
        this.setState({
            panel: panel
        });
    };

    panelDistributor = (action) => {
        const state = StateStore.getInstance();
        let currentlyActive = state.get('chatElement');
        let type;
        if (!currentlyActive) {
            type = "";
        }
        else {
            //group or user
            type = currentlyActive.classList[0];

        }

        switch (action.target.innerText){
            case "add":
                this.toggleModal("add");
                break;
            case "Remove":
                this.removePanel(type);
                break;
            case "Update":
                this.updatePanel(type);
                break;
        }
    };

    removePanel = (type: string) =>{
        this.toggleModal("delete");
    };

    updatePanel = (type: string) => {
        this.toggleModal("update");
    };

    addingSomething = (object, type) => {
        const state = StateStore.getInstance();
        if (type === 'user'){
            ServerAPI.createUser(object)
                .then((currentUsers) => {
                if (currentUsers){
                    alert("added successfully");
                    this.updateItemsInStateStore("user",currentUsers);

                    if (state.get('chatElement')){
                        MyFunctions.makeActive(state.get('chatElement'));
                    }
                }
                else {
                    alert('Cant add!');
                }
            });
        }
        else {
            ServerAPI.createGroup(object)
                .then((currentGroups) => {
                    if (currentGroups){
                        alert("added successfully");
                        this.updateItemsInStateStore("group",currentGroups);

                        if (state.get('chatElement')){
                            MyFunctions.makeActive(state.get('chatElement'));
                        }
                    }
                    else {
                        alert('Cant add!');
                    }
                });
        }
        this.cancelModal();
    };

    deletingSomething = (flatten) => {
        const state = StateStore.getInstance();
        let object = MyFunctions.getChatEntity(state.get('chatElement').innerText);
        object.flatten = flatten;
        let type;
        if (object.members) {
            type = "group";
        }
        else {
            type = "user";
        }

        if (type === 'user'){
            ServerAPI.deleteUser(object)
                .then((currentUsers) => {
                    if (currentUsers){
                        alert("deleted successfully");
                        this.updateItemsInStateStore("user",currentUsers,true);
                    }
                    else {
                        alert('Cant delete!');
                    }
                });
        }
        else {
            ServerAPI.deleteGroup(object)
                .then((currentGroups) => {
                    if (currentGroups){
                        alert("deleted successfully");
                        this.updateItemsInStateStore("group",currentGroups,true);
                    }
                    else {
                        alert('Cant delete!');
                    }
                });
        }
        this.cancelModal();
    };

    updateSomething = (object, type) => {
        if (type === 'user'){
            ServerAPI.updateUser(object)
                .then((currentUsers) => {
                    if (currentUsers){
                        alert("updated successfully!");
                        this.updateItemsInStateStore("user",currentUsers);
                    }
                    else {
                        alert('Cant update!');
                    }
                });
        }
        else {
            switch (object.action){
                case "updateName":
                    ServerAPI.updateGroup(object)
                        .then((currentGroups) => {
                            if (currentGroups){
                                this.updateItemsInStateStore("group",currentGroups);
                            }
                            else {
                                alert('Cant update!');
                            }
                        });
                    break;
                case "addGroupToMe":
                    ServerAPI.addGroupToGroup(object.whoParent, object.movingGroup)
                        .then((currentGroups) => {
                            if (currentGroups){
                                alert("updated successfully!");
                                this.updateItemsInStateStore("group",currentGroups);
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
                case "moveMeToGroup":
                    ServerAPI.addGroupToGroup(object.whoParent, object.movingGroup)
                        .then((currentGroups) => {
                            if (currentGroups){
                                alert("updated successfully!");
                                this.updateItemsInStateStore("group",currentGroups,true);
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
                case "addUserToMe":
                    ServerAPI.addUserToGroup(object.group_name, object.addedUser)
                        .then((currentGroups) => {
                            if (currentGroups){
                                alert("updated successfully!");
                                this.updateItemsInStateStore("group",currentGroups);
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
                case "removeUserFromMe":
                    ServerAPI.removeUserFromGroup(object.group_name, object.removedUser)
                        .then((currentGroups) => {
                            if (currentGroups){
                                alert("updated successfully!");
                                this.updateItemsInStateStore("group",currentGroups);
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
            }
        }
        this.cancelModal();
    };

    updateItemsInStateStore = (type, items, init?) => {
        const state = StateStore.getInstance();
        if (init){
            state.set('inChatWith', null);
            state.set('chatEntity', null);
        }
        if (type === "group"){
            state.set("allGroups", items);
        }
        else {
            state.set("allUsers", items);
        }
        state.set("allEntities", StateStore.getInstance().createEntities());
    };

    cancelModal = () => {
        this.setState({
            panel: ""
        });
    };

    public render() {

        let modal = null;

        switch (this.state.panel) {
            case "add":
                modal = <AddingPanel styles={styles} cancelCallback={this.cancelModal} submitCallback={this.addingSomething} AddTypes={["user", "group"]}/>;
                break;
            case "delete":
                let workingObject = MyFunctions.getUserOrGroup(MyFunctions.getChatEntity(StateStore.getInstance().get('chatElement').innerText));
                modal = <DeletingPanel styles={styles} deleteObject={workingObject} cancelCallback={this.cancelModal} submitCallback={this.deletingSomething}/>;
                break;
            case "update":
                workingObject = MyFunctions.getUserOrGroup(MyFunctions.getChatEntity(StateStore.getInstance().get('chatElement').innerText));
                modal = <UpdatingPanel styles={styles} updateObject={workingObject} groups={StateStore.getInstance().get("allGroups")} users={StateStore.getInstance().get("allUsers")} cancelCallback={this.cancelModal} submitCallback={this.updateSomething}/>;
                break;
        }

        return (
        <div className={'adminPanel'}>
            <MyButton contentSTR={"add"} callbackFunc={this.panelDistributor} disabled={false} className={"adminButton addButton"}/>
            <MyButton contentSTR={"Remove"} callbackFunc={this.panelDistributor} disabled={this.state.disabled} className={"adminButton deleteButton"}/>
            <MyButton contentSTR={"Update"} callbackFunc={this.panelDistributor} disabled={this.state.disabled} className={"adminButton updateButton"}/>

            {modal ? modal : <div/>}
        </div>
        )
    }
}

export default AdminPanel;
