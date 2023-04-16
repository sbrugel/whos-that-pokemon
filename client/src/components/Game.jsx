import React, { useEffect, useState } from 'react';
import axios from 'axios';

import OptionButton from './OptionButton';

/*
const settings = {
    cries: boolean,
    hardMode: boolean,
    oneTry: boolean,
    quiz: boolean
}
if only I did this in typescript
*/
const Game = ({ settings }) => {
    const MIN_DEX = 1;
    const MAX_DEX = 889;
    const EXCLUDE = [802, 803, 804, 805, 806, 807, 808, 809]
    const [dexNum, setDexNum] = useState(0);
    const [image, setImage] = useState(null);

    const [audioPlaying, setAudioPlaying] = useState(false);
    const [roundComplete, setRoundComplete] = useState(false);

    // the option buttons (for multiple choice)
    const [options, setOptions] = useState([]);
    const [correct, setCorrect] = useState(null);
    const [wrong, setWrong] = useState([]);

    // the text input (for hard mode)
    const [input, setInput] = useState('');

    // toggles whether all components should render
    const [renderNow, setRenderNow] = useState(false);

    const shuffleArray = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    useEffect(() => {
        startRound(); // start a new round (pick a mon and wrong options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const startRound = () => {
        setRenderNow(false);
        setRoundComplete(false);
        setCorrect(null);
        setWrong([]);
        let num;
        do {
            num = Math.floor(Math.random() * (MAX_DEX - MIN_DEX + 1)) + MIN_DEX
        } while (EXCLUDE.includes(num));
        setDexNum(num);
    }

    useEffect(() => {
        if (dexNum === 0) return; // don't do anything right when the page loads. Wait until this actually gets set to something
        setImage(require(`../img/${dexNum}.png`));
        axios.get(`https://pokeapi.co/api/v2/pokemon/${dexNum}/`).then((res) => {
            setCorrect(res.data.name.charAt(0).toUpperCase() + res.data.name.slice(1));
        })
    }, [dexNum]);

    useEffect(() => {
        if (dexNum === 0 || !correct) return; // don't run when the page initially loads; also do not run on hard mode
        if (settings.hardMode) {
            setWrong(null);
            return;
        }

        for (let i = 0; i < 3; i++) {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * (MAX_DEX - MIN_DEX + 1)) + MIN_DEX}/`).then((res) => {
                const str = res.data.name;
                const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
                if (wrong.includes(capitalized) || capitalized === correct) {
                    i--;
                } else {
                    setWrong(prevState => [...prevState, capitalized]); // react will correctly recognize the state change here since we are pushing to an array
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [correct])

    useEffect(() => {
        if (dexNum === 0) return; // don't run when the page initially loads
        setOptions(shuffleArray([correct, ...wrong]));
        setRenderNow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wrong])

    useEffect(() => {
        if (!image || roundComplete) return; // don't blacken the image immediately on load, or when the round is over

        const img = new Image();
        img.src = require(`../img/${dexNum}.png`);

        img.onload = () => {
            // create a new canvas element with the same dimensions as the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
          
            // draw the image onto the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
          
            // get the pixel data of the canvas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
          
            // set all the opaque pixel values to black
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 0) { // not a transparent pixel?
                    data[i] = 0;     // red
                    data[i + 1] = 0; // green
                    data[i + 2] = 0; // blue
                }
            }
          
            // Put the modified pixel data back onto the canvas
            ctx.putImageData(imageData, 0, 0);
          
            // Get the data URL of the modified image
            const dataUrl = canvas.toDataURL('image/png');
            setImage(dataUrl);
          };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image])

    const playSound = () => {
        const audio = new Audio(require(`../sfx/${dexNum}.mp3`));

        // round complete; set boolean to true, undarken image, and play cry
        setRoundComplete(true);
        setImage(`https://pokemoncries.com/pokemon-images/${dexNum}.png`);
        
        if (!settings.cries) return;
        
        audio.play();
        setAudioPlaying(true);
        audio.addEventListener("ended", () => {
            setAudioPlaying(false);
        });
    }

    const handleTextInputChange = (e) => {
        setInput(e.target.value);
    }

    const UI = 
        <div style={{
            width: "25%",
            height: "10vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px"
        }}>
        {
            roundComplete 
            ?
            <>
                <p>That's right!</p>
                <button onClick={() => {
                    setRenderNow(false);
                    startRound();
                }} disabled={audioPlaying}>Next Round</button>
            </>
            :
            <>
                <p>Who's that Pokemon?</p>
                { !settings.hardMode
                ? 
                options.map((text) => {
                    return (
                        <>
                            <OptionButton text={ (renderNow && wrong.length > 2) ? text : 'Waiting...' } correct={ text === correct } call={ playSound } enabled={(renderNow && wrong.length > 2)} />
                            <br />
                        </>
                    )
                })
                : 
                <>
                    <input type="text" onChange={ handleTextInputChange } />
                    <br />
                    <OptionButton text='Submit' correct={ (input.toLowerCase().charAt(0).toUpperCase() + input.toLowerCase().slice(1)) === correct } call={ playSound } enabled={(renderNow)} />
                </> }
            </>
        }
        </div>

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(https://external-preview.redd.it/e5zoQw-hgw-LCjdhC_4G8IAcHxex5pzda_BD_FPTcBY.png?auto=webp&s=c0b96b5ec20010a15864b8a0c9b202c119e52fe8)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "50%",
                    width: "50%",
                    border: "5px solid",
                    padding: "50px"
                }}
            >
                <img 
                    src={image} 
                    style={{
                        position: "relative",
                        top: "20%",
                        right: "20%",
                        height: "70%"
                    }}
                    alt="" /><br />
            </div>

            { UI }
        </>
    )
    
}

export default Game;