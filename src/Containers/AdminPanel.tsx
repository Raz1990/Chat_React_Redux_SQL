import * as React from 'react';

import MyButton from "../Components/MyButton";
import AddingPanel from "../Components/AddingPanel";
import DeletingPanel from "../Components/DeletingPanel";
import UpdatingPanel from "../Components/UpdatingPanel";
import styles from "./../Styles/styles";
import {ServerAPI} from "../ServerAPI";
import {store} from './../Redux/store';
import Helpers from "../Classess/helpers";
import {toast} from "react-toastify";

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
                    Helpers.addAIReply(object.user_name);
                    this.addSuccess();
                }
                else {
                    this.showToastError('Cant add!');
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
                        this.showToastError('Cant add!');
                    }
                });
        }
        this.cancelModal();
    };

    addSuccess = () => {
        this.showToastSuccess("added successfully");
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
                        this.showToastSuccess("deleted successfully");
                        Helpers.storeAllEntities();
                    }
                    else {
                        this.showToastError('Cant delete!');
                    }
                });
        }
        else {
            object.setParentGroup(null);
            ServerAPI.deleteGroup(object)
                .then((affectedRows) => {
                    if (affectedRows){
                        this.showToastSuccess("deleted successfully");
                        Helpers.storeAllEntities();
                    }
                    else {
                        this.showToastError('Cant delete!');
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
                        this.showToastSuccess("updated successfully!");
                        Helpers.storeAllEntities();
                    }
                    else {
                        this.showToastError('Cant update!');
                    }
                });
        }
        else {
            switch (object.action){
                case "updateName":
                    ServerAPI.updateGroup(object)
                        .then((affectedRows) => {
                            if (affectedRows){
                                this.showToastSuccess("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                this.showToastError('Cant update!');
                            }
                        });
                    break;
                case "addGroupToMe":
                    ServerAPI.addGroupToGroup(object.whoParent, object.movingGroupId)
                        .then((affectedRows) => {
                            if (affectedRows){
                                Helpers.decideVisibility(store.getState()['chatElement']);
                                this.showToastSuccess("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                this.showToastError('Cant move!');
                            }
                        });
                    break;
                case "moveMeToGroup":
                    ServerAPI.addGroupToGroup(object.whoParent, object.movingGroupId)
                        .then((affectedRows) => {
                            if (affectedRows){
                                Helpers.decideVisibility(store.getState()['chatElement']);
                                this.showToastSuccess("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                this.showToastError('Cant move!');
                            }
                        });
                    break;
                case "addUserToMe":
                    ServerAPI.addUserToGroup(object.id, object.addedUserId)
                        .then((affectedRows) => {
                            if (affectedRows){
                                Helpers.decideVisibility(store.getState()['chatElement']);
                                this.showToastSuccess("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                this.showToastError('Cant move!');
                            }
                        });
                    break;
                case "removeUserFromMe":
                    ServerAPI.removeUserFromGroup(object.id, object.removedUserId)
                        .then((affectedRows) => {
                            if (affectedRows){
                                Helpers.decideVisibility(store.getState()['chatElement']);
                                this.showToastSuccess("updated successfully!");
                                Helpers.storeAllEntities();
                            }
                            else {
                                this.showToastError('Cant move!');
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

    showToastSuccess(content){
        toast.success(content, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            pauseOnHover: false,
            hideProgressBar: true
        });
    }

    showToastError(content){
        toast.error(content, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            pauseOnHover: false,
            hideProgressBar: true
        });
    }

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
