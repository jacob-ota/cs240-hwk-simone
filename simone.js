/**
 * Simone the Memory Game
 * 
 * @author Jacob Ota
 */
// query selectors for rounds and buttons
let round_count = document.querySelector("#rounds");
let button = document.querySelector("#play");
// and squares
let blueSquare = document.querySelector("#blueSq")
let redSquare = document.querySelector("#redSq")
let greenSquare = document.querySelector("#greenSq")
let yellowSquare = document.querySelector("#yellowSq")
// and status and background
let statusP = document.querySelector("#status")
let background = document.querySelector("body")
let colors = document.querySelector("div")

//values to be used later: rounds, player input
let round_num = 10;
let playerInput = "";

//change value of round number if the input is changed
round_count.addEventListener("input", () => {
    round_num = round_count.value;
});

/**
 * This function uses the axios.get on the simone api to retrieve the random start-up sequence that will be
 * displayed at the start of every game.
 * 
 * @returns string of either an error or a random start sequence taken from the api
 */
async function getStartSequence() {
    try {
        const hdrs = {
            headers: { Accept: "application/json"}
        }
        //get the start seq from api
        let test = await axios.get("http://cs.pugetsound.edu/~dchiu/cs240/api/simone/?cmd=start", hdrs);
        return test.data.sequence
    } catch(err) {
        //return an error if this fails
        return "error!"
    }
}

/**
 * This function uses the axios.get on the simone api to retrieve the random play sequence that will be
 * displayed at the start of every game. The round number for the length of the play sequence is based
 * on the amount of rounds the user wants to play.
 * 
 * @param {*} rounds number of rounds the user want to play
 * @returns string of either an error or a random play sequence based on round length taken from the api
 */
async function getPlaySequence(rounds) {
    try {
        const hdrs = {
            headers: { Accept: "application/json"}
        }
        //get the play seq with rounds from the api
        let test = await axios.get(`http://cs.pugetsound.edu/~dchiu/cs240/api/simone/?cmd=getSolution&rounds=${rounds}`, hdrs);
        return test.data.key;
    } catch(err) {
        //return an error if this fails
        return "error!";
    }
}

/**
 * This function runs the start sequence that is retrieved by the api and flashes the colors in the correct 
 * order that the sequence specifies. Also plays sounds and changes colors briefly on flash.
 */
async function runStartSeq() {
    //wait to get the start seq from api
    let startSeq = await getStartSequence();
    for(let i = 0; i < startSeq.length; i++) {
        //for every color in the start seq check what color and display that color with sound
        if(startSeq[i] == 'R') {
            new Audio("sounds/red.wav").play();
            redSquare.style.backgroundColor = "hotpink";
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(redSquare.style.backgroundColor = "red")
                }, 120)
            );
        }
        else if(startSeq[i] == 'G') {
            new Audio("sounds/green.wav").play();
            greenSquare.style.backgroundColor = "lightgreen";
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(greenSquare.style.backgroundColor = "green")
                }, 120)
            );
        }
        else if(startSeq[i] == 'B') {
            new Audio("sounds/blue.wav").play();
            blueSquare.style.backgroundColor = "lightblue";
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(blueSquare.style.backgroundColor = "blue")
                }, 120)
            );
        }
        else if(startSeq[i] == 'Y') {
            new Audio("sounds/yellow.wav").play();
            yellowSquare.style.backgroundColor = "lightyellow";
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(yellowSquare.style.backgroundColor = "yellow");
                }, 120)
            );
        }
        //wait 120 ms to play next color
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, 120)
        );
    }
}

//run the play sequence while waiting for player input
async function initPlaySeq(rounds) {
    //wait for the play sequence to be retrieved
    let playSeq = await getPlaySequence(rounds);
    let simonePlay = new Array(); //array to hold the next color in playSeq
    let continuePlay = true;
    let i = 0;
    while(continuePlay == true) {
        //push each iteration of playSeq onto the array
        simonePlay.push(playSeq[i])
        //run through the all entries up to any given round based on the simonePlay array
        for(let j = 0; j < simonePlay.length; j++) {
            //for every color in the simonePlay seq check what color and display that color with sound
            if(playSeq[j] == 'R') {
                new Audio("sounds/red.wav").play();
                redSquare.style.backgroundColor = "hotpink";
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(redSquare.style.backgroundColor = "red")
                    }, 200)
                );
            }
            else if(playSeq[j] == 'G') {
                new Audio("sounds/green.wav").play();
                greenSquare.style.backgroundColor = "lightgreen";
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(greenSquare.style.backgroundColor = "green")
                    }, 200)
                );
            }
            else if(playSeq[j] == 'B') {
                new Audio("sounds/blue.wav").play();
                blueSquare.style.backgroundColor = "lightblue";
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(blueSquare.style.backgroundColor = "blue")
                    }, 200)
                );
            }
            else if(playSeq[j] == 'Y') {
                new Audio("sounds/yellow.wav").play();
                yellowSquare.style.backgroundColor = "lightyellow";
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(yellowSquare.style.backgroundColor = "yellow");
                    }, 200)
                );
            }
            //400 ms buffer between next color display
            if(simonePlay.length > 1) {
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve();
                    }, 400)
                );
            }
        }

        //--------------------
        //CODE HERE to wait for a user button press
        //--------------------

        //if it gets to the end of the game and continuePlay is still true
        if(simonePlay.length == playSeq.length && continuePlay == true) {
            //run the win progression
            new Audio("sounds/win.mp3").play();
            background.style.backgroundColor = "DeepSkyBlue"
            statusP.innerHTML = `YAY! YOU WIN!!!`
            //exit out of the while loop
            continuePlay == false;
            break;
        }
        //between round buffer or end if wrong button is pressed
        if(continuePlay == true) {
            //run the next round progression
            statusP.innerHTML = `Good job! Prepare for next round.`
            new Audio("sounds/nextRound.wav").play();
            //stop showing the next round if it reaches the end of the playSeq and update the status
            if((i+2) != playSeq.length + 1) {
                //wait 800 ms to update the status
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(statusP.innerHTML = `Round ${i + 2} of ${playSeq.length}`);
                    }, 800)
                );
            }
            //wait another 800 ms till running the next round and update the counter
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, 800)
            );
            i++;
        }
        else{
            //run the losing progression for an incorrect response
            statusP.innerHTML = `Incorrect! You lose!`
            await new Audio("sounds/wrong.wav").play();
            background.style.backgroundColor = "hotpink"
            await new Audio("sounds/lose.wav").play();
            break;
        }
    }
}

//run the start sequence
button.addEventListener("click", async () => {
    //run the start sequence
    await runStartSeq();
    //wait 4 seconds after the start sequence to begin the first round
    await new Promise((resolve) =>
    setTimeout(() => {
        resolve();
    }, 4000)
    );
    //run the play sequence
    initPlaySeq(round_num);
});