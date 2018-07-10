import * as React from 'react';

import MyButton from "../Components/MyButton";
import AddingPanel from "../Components/AddingPanel";
import DeletingPanel from "../Components/DeletingPanel";
import UpdatingPanel from "../Components/UpdatingPanel";
import styles from "./../Styles/styles";
import {ServerAPI} from "../ServerAPI";
import {store} from './../Redux/store';
import Helpers from "../Classess/helpers";

interface IPanelState {
    panel: string
    disabled: boolean
}

interface IPanelProps {
}

class AdminPanel extends React.Component<IPanelProps,IPanelState> {

    workingObject;

    constructor(props: IPanelProps){
        super(props);

        let disabled = true;

        if (store.getState()['chatElement']) {
            disabled = false;
        }

        this.state = {
            panel: "",
            disabled: disabled
        };

        store.subscribe(() => {
            let disabled = true;

            if (store.getState()['chatElement']) {
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
        let currentlyActive = store.getState()['chatElement'];
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
        if (type === 'user'){
            ServerAPI.createUser(object)
                .then((insertId) => {
                if (insertId){
                    this.addSuccess();
                }
                else {
                    alert('Cant add!');
                }
            });
        }
        else {
            ServerAPI.createGroup(object)
                .then((insertId) => {
                    if (insertId){
                        this.addSuccess();
                    }
                    else {
                        alert('Cant add!');
                    }
                });
        }
        this.cancelModal();
    };

    addSuccess = () => {
        alert("added successfully");
        Helpers.storeAllEntities();

        if (store.getState()['chatElement']){
            Helpers.makeActive(store.getState()['chatElement']);
        }
    };

    deletingSomething = (flatten) => {
        let object = this.workingObject;
        object.flatten = flatten;

        if (object.getType() === 'user'){
            ServerAPI.deleteUser(object)
                .then((affectedRows) => {
                    if (affectedRows){
                        alert("deleted successfully");
                        Helpers.storeAllEntities();
                    }
                    else {
                        alert('Cant delete!');
                    }
                });
        }
        else {
            ServerAPI.deleteGroup(object)
                .then((affectedRows) => {
                    if (affectedRows){
                        alert("deleted successfully");
                        Helpers.storeAllEntities();
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
                .then((affectedRows) => {
                    if (affectedRows){
                        alert("updated successfully!");
                        Helpers.storeAllEntities();
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
                        .then((affectedRows) => {
                            if (affectedRows){
                                alert("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                alert('Cant update!');
                            }
                        });
                    break;
                case "addGroupToMe":
                    ServerAPI.addGroupToGroup(object.whoParent, object.movingGroup)
                        .then((affectedRows) => {
                            if (affectedRows){
                                alert("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
                case "moveMeToGroup":
                    ServerAPI.addGroupToGroup(object.whoParent, object.movingGroup)
                        .then((affectedRows) => {
                            if (affectedRows){
                                alert("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
                case "addUserToMe":
                    ServerAPI.addUserToGroup(object.group_name, object.addedUser)
                        .then((affectedRows) => {
                            if (affectedRows){
                                alert("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                alert('Cant move!');
                            }
                        });
                    break;
                case "removeUserFromMe":
                    ServerAPI.removeUserFromGroup(object.group_name, object.removedUser)
                        .then((affectedRows) => {
                            if (affectedRows){
                                alert("updated successfully!");
                                Helpers.storeAllEntities();
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

    cancelModal = () => {
        this.setState({
            panel: ""
        });
    };

    public render() {

        let modal = null;
        if (store.getState()['chatElement']) {
            this.workingObject = Helpers.getChatEntity(parseInt(store.getState()['chatElement'].id), store.getState()['chatElement'].innerText);
        }
        switch (this.state.panel) {
            case "add":
                modal = <AddingPanel styles={styles} cancelCallback={this.cancelModal} submitCallback={this.addingSomething} AddTypes={["user", "group"]}/>;
                break;
            case "delete":
                modal = <DeletingPanel styles={styles} deleteObject={this.workingObject} cancelCallback={this.cancelModal} submitCallback={this.deletingSomething}/>;
                break;
            case "update":
                modal = <UpdatingPanel styles={styles} updateObject={this.workingObject} groups={store.getState()["allGroups"]} users={store.getState()["allUsers"]} cancelCallback={this.cancelModal} submitCallback={this.updateSomething}/>;
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
