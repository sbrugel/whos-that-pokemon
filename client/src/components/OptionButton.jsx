import React from 'react';

const OptionButton = ({ text, correct, call }) => {
    return (
        <button onClick={() => { 
            if (correct) {
                call();
            } else {
                alert('Not quite. Try again!');
            }
        }}>{ text }</button>
    )
}

export default OptionButton;