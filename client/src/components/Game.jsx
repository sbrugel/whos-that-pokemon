import React, { useEffect, useState } from 'react';
import axios from 'axios';

import OptionButton from './OptionButton';

const Game = () => {
    const MIN_DEX = 1;
    const MAX_DEX = 99;
    const [dexNum, setDexNum] = useState(0);
    const [image, setImage] = useState(null);

    const [audioPlaying, setAudioPlaying] = useState(false);
    const [roundComplete, setRoundComplete] = useState(false);

    const [options, setOptions] = useState([]);
    const [correct, setCorrect] = useState(null);
    const [wrong, setWrong] = useState([]);

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
    }, [])

    const startRound = () => {
        setRenderNow(false);
        setRoundComplete(false);
        setWrong([]);
        setDexNum(Math.floor(Math.random() * (MAX_DEX - MIN_DEX + 1)) + MIN_DEX);
    }

    useEffect(() => {
        if (dexNum === 0) return; // don't do anything right when the page loads. Wait until this actually gets set to something
        setImage(require(`../img/${dexNum}.png`));
        axios.get(`https://pokeapi.co/api/v2/pokemon/${dexNum}/`).then((res) => {
            setCorrect(res.data.name.charAt(0).toUpperCase() + res.data.name.slice(1));
        })
    }, [dexNum]);

    useEffect(() => {
        if (!correct) return; // don't run when the page initially loads

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
        if (wrong.length === 0) return; // don't run when the page initially loads
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
        
        audio.play();
        setAudioPlaying(true);
        audio.addEventListener("ended", () => {
            setAudioPlaying(false);
        });
    }

    if (renderNow) {
        return (
            <>
                <img src={image} alt="" /><br />
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
                        { options.map((text) => (
                            <>
                                <OptionButton text={ text || 'default' } correct={ text === correct } call={ playSound } /><br />
                            </>
                        ))}
                    </>
                }
            </>
        )
    } else {
        return (
            <p>Waiting...</p>
        )
    }
    
}

export default Game;