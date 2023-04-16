import React from 'react';

const OptionButton = ({ text, correct, callIfCorrect, callIfWrong, enabled }) => {
    return (
        <>
            <button onClick={() => { 
                if (correct) {
                    callIfCorrect();
                } else {
                    callIfWrong();
                }
            }}
            disabled={!enabled}
            >{ text }</button>
        </>
    )
}

export default OptionButton;