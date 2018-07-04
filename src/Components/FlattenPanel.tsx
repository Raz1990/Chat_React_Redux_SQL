import * as React from 'react';

import Modal from "./../Components/Modal";

interface IDelProps {
    styles;
    submitCallback;
}

interface IDelState {
}

class FlattenPanel extends React.Component<IDelProps,IDelState> {

    constructor(props: IDelProps){
        super(props);

        this.state = {};
    }

    AddInteraction(){
        return (
            <div>
                <p style={this.props.styles.p}>
                    <label style={this.props.styles.label} htmlFor="user_name">would you like to move the users to the parent?</label>
                 </p>
            </div>
        );
    }

    submitYes = () => {
        this.props.submitCallback(true);
    };

    submitNo = () => {
        this.props.submitCallback(false);
    };

    public render() {

        const divSelected = this.AddInteraction();

        return (
            <Modal style={this.props.styles.modal}>
                {divSelected}
                <div className={"buttonsWrapper"}>
                    <button style={this.props.styles.button} onClick={this.submitYes}>Yes</button>
                    <button style={this.props.styles.cancelButton} onClick={this.submitNo}>No</button>
                </div>
            </Modal>
        )
    }
}

export default FlattenPanel;
