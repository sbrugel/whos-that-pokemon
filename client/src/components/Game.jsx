import React, { useEffect, useState } from 'react';
import Jimp from 'jimp';

const Game = () => {
    const MIN_DEX = 1;
    const MAX_DEX = 99;
    const [dexNum, setDexNum] = useState(0);
    const [image, setImage] = useState(null);

    // on load:
    // - select a new pokemon
    // - make the selected Pokemon sprite image black (except on transparent pixels)
    useEffect(() => {
        setDexNum(Math.floor(Math.random() * (MAX_DEX - MIN_DEX + 1)) + MIN_DEX);
    }, []);

    useEffect(() => {
        if (dexNum === 0) return; // on initial load
        setImage(`https://pokemoncries.com/pokemon-images/${dexNum}.png`);
    }, [dexNum]);

    useEffect(() => {
        if (!image) return; // on initial load

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

    return (
        <>
            <img src={image} alt="" />
        </>
    )
}

export default Game;