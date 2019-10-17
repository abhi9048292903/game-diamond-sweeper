// Game Diamond sweeper 
// @author: Abhilash KK

(function() {
    'use strict'
    const gameContainer = document.getElementsByClassName('game-container')[0]

    const backgroundImgs = {
        'bg-question-img': 'assets/images/question.png',
        'bg-diamond-img': 'assets/images/diamond.png',
        'bg-arrow-img': 'assets/images/arrow.png',
        'bg-question-position': '650px',
        'bg-diamond-position': '5px',
        'bg-size': 'contain',
        'bg-repeat': 'no-repeat'
    }

    let flipCount = 0,
        randomPositions = [],
        maxScore;

    // generate random positions for diamonds
    function generateRandomPositions() {
        const totalDiamonds = 8;
        // clear the old positions if exists
        randomPositions.length = 0;

        for (let i = 0; i < totalDiamonds; i++) {
            let position = Math.ceil(Math.random() * 61);
            if (!randomPositions.includes(`box-${position}`)) {
                randomPositions.push(`box-${position}`);
            }
        }
        if (randomPositions.length !== totalDiamonds) {
            let more = totalDiamonds - randomPositions.length;
            for (let j = 1; j <= more; j++) {
                randomPositions.push(`box-${61 + j}`);
            }
        }
        console.log('positons ', randomPositions)
    }

    function gameInit() {

        // clear all parameters
        flipCount = 0;
        maxScore = 56;

        generateRandomPositions();

        for (let gridbox of gameContainer.children) {
            //adding eventlistener for each box to flip image
            gridbox.addEventListener('click', flipImage);
            let boxid = gridbox.getAttribute('id');

            // remove hint spans 
            if (gridbox.hasChildNodes()) {
                gridbox.innerHTML = ''
            }
            // add background image question and diamond for selected positions
            // add questions to non selected
            if (randomPositions.includes(boxid)) {
                gridbox.style.backgroundImage = `url(${backgroundImgs['bg-diamond-img']}), url(${backgroundImgs['bg-question-img']})`;
                gridbox.style.backgroundPosition = `${backgroundImgs['bg-question-position']}, ${backgroundImgs['bg-diamond-position']}`;
                gridbox.style.backgroundSize = `${backgroundImgs['bg-size']}`;
                gridbox.style.backgroundRepeat = `${backgroundImgs['bg-repeat']}`;
                // appending neighbour hint for diamond
                let neighbour = Number(boxid.split('-')[1]) - 1;
                if (neighbour >= 1 && neighbour % 8 != 0) {
                    if (!randomPositions.includes(`box-${neighbour}`)) {
                        let hintBox = document.getElementById(`box-${neighbour}`);
                        let hintSpan = document.createElement('span');
                        hintSpan.className = 'hint-arrow';
                        hintBox.appendChild(hintSpan);
                    }
                }

            } else {
                gridbox.style.backgroundImage = `url(${backgroundImgs['bg-question-img']})`;
                gridbox.style.backgroundPosition = `center`;
                gridbox.style.backgroundSize = `${backgroundImgs['bg-size']}`;
                gridbox.style.backgroundRepeat = `${backgroundImgs['bg-repeat']}`;
            }
            // all gridbox bg to white
            gridbox.style.backgroundColor = '#F6F9FF';
            // add hit to ne
        }

    }

    function flipImage(event) {
        // get item 
        let id = event.target.id
            // handaling hint span click
        if (event.target.tagName !== 'DIV') {
            return
        }
        let selectedItem = document.getElementById(id);
        // audio elements
        let audioElements = document.getElementsByClassName('audio-section')[0]
        if (randomPositions.includes(id)) {
            flipCount++;
            selectedItem.style.backgroundColor = '#2B91FF';
            if (flipCount !== 8) {
                selectedItem.style.backgroundPosition = `${backgroundImgs['bg-diamond-position']},${backgroundImgs['bg-question-position']}`
            } else {
                selectedItem.style.backgroundPosition = `${backgroundImgs['bg-diamond-position']},${backgroundImgs['bg-question-position']}`
                selectedItem.removeEventListener('click', flipImage);
                scoreDisplay(maxScore);
                gameInit();
                // game over sound
                audioElements.children[2].play();
                return;
            }
            // play diamond found sound
            audioElements.children[0].play();

        } else {
            maxScore--;
            selectedItem.style.background = 'none'
            audioElements.children[1].play();
        }
        selectedItem.removeEventListener('click', flipImage);
    }

    function scoreDisplay(totalScore) {
        let scoreDiv = document.getElementById('scorecard');
        scoreDiv.firstElementChild.innerHTML = `Your Score is ${totalScore}`;
        scoreDiv.style.display = 'block'
    }

    gameInit();
})();