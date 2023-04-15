import React from 'react';

const OptionButton = ({ text, correct, call, enabled }) => {
    return (
        <button onClick={() => { 
            if (correct) {
                call();
            } else {
                alert('Not quite. Try again!');
            }
        }}
        disabled={!enabled}
        >{ text }</button>
    )
}

export default OptionButton;