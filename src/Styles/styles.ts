import * as React from "react";

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        minWidth: '25em'
    },
    p: {
        margin: "0 0 0.5em 0",
    },
    label: {
        display: "inline-block",
        marginBottom: ".5rem"
    },
    input: {
        display: "block",
        width: "100%",
        outline: 'none'
    },
    button: {
        background: '#86BB71',
        color: 'white',
        padding: '5px',
        marginRight: '10px',
        marginLeft: '10px'
    },
    div: {
        textAlign: 'center'
    }
};

styles.buttonDisabled = {
    ...styles.button,
    cursor: 'auto',
    background: '#DDDDDD',
    color: '#444753'
};

styles.cancelButton = {
    ...styles.button,
    cursor: 'auto',
    background: 'red',
    color: '#444753'
};

export default styles;