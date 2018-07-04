import * as React from 'react';

import Modal from "./../Components/Modal";
import Flatten from "./../Components/FlattenPanel";

interface IDelProps {
    styles;
    deleteObject;
    submitCallback;
    cancelCallback;
}

interface IDelState {
    affirmation: boolean
}

class DeletingPanel extends React.Component<IDelProps,IDelState> {

    objectType = this.props.deleteObject.getType();

    constructor(props: IDelProps){
        super(props);

        this.state = {
            affirmation: false
        };
    }

    AddInteraction(){
        let divToRender = this.state.affirmation ? <Flatten styles={this.props.styles} submitCallback={this.props.submitCallback}/>
            : (
            <div>
                <p style={this.props.styles.p}>
                    <label style={this.props.styles.label} htmlFor="user_name">Are you sure you want to delete?</label>
                </p>
            </div>
        );

        return divToRender;
    }

    maybeAffirm = () => {
        if (this.objectType === 'group'){
            if (this.props.deleteObject.getGroupMembers().length === 1) {
                this.setState({
                    affirmation: true
                });
            }
        }
        else {
            this.props.submitCallback(false);
        }
    };

    public render() {

        const divSelected = this.AddInteraction();

        return (
            <Modal style={this.props.styles.modal}>
                {divSelected}
                <div className={"buttonsWrapper"}>
                    <button style={this.props.styles.button} onClick={this.maybeAffirm}>Yes, delete</button>
                    <button style={this.props.styles.cancelButton} onClick={this.props.cancelCallback}>Cancel</button>
                </div>
            </Modal>
        )
    }
}

export default DeletingPanel;
