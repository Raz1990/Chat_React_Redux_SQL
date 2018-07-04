import * as React from 'react';

interface IMyButtonPROPS {
    contentSTR: string,
    className?: string,
    callbackFunc?: any
    disabled?: boolean
}

class MyButton extends React.Component<IMyButtonPROPS,{}> {

    constructor(props: IMyButtonPROPS){
        super(props);

    }

    public render() {
        return (
            <button onClick={this.props.callbackFunc} className={this.props.className} disabled={this.props.disabled}>{this.props.contentSTR}</button>
        );
    }
}

export default MyButton;