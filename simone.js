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

/**
 * This function runs the whole game, it runs through each spot of the play sequence in a 1..1,2..1,2,3..(etc)
 * pattern till the end of the play sequence, and takes in user input and based on that input it determines whether
 * to move on to the next round or terminate the game. And if the user successfully finished the whole sequence
 * the winning progression will be played.
 * 
 * @param {*} rounds takes in the number of rounds that will be played for the game
 */
async function initPlaySeq(rounds) {
    //wait for the play sequence to be retrieved
    let playSeq = await getPlaySequence(rounds);
    let simonePlay = new Array(); //array to hold the next color in playSeq
    let continuePlay = true;
    let i = 0;
    //create a buffer that decreases in higher rounds
    let buttonBuffer = 400
    while(continuePlay == true) {
        console.log(buttonBuffer)
        if(buttonBuffer > 200) {
            buttonBuffer *= .92;
        }
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
            //buffer between next color display (*Optional increase of speed on higher rounds)
            if(simonePlay.length > 1) {
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve();
                    }, buttonBuffer)
                );
            }
        }
        //waits for a user button press
        continuePlay = await userPlay(simonePlay)
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

/**
 * This function takes the array of a specific rounds sequence and based on player input it compares that
 * to the color at that specific point. If it is the same it continues the sequence and if it is not the 
 * same then it returns false that will ultimately end the game.
 * 
 * @param {*} simonePlay the array of the round that is being played at any given round.
 * @returns boolean true continues the game and a false ends the game
 */
async function userPlay(simonePlay) {
    //playCount is used to show how many more selections need to be made in the status
    let playCount = simonePlay.length;
    for(let i = 0; i < simonePlay.length; i++) {
        //display how many more selections need to be made after the first color the user
        // selects and it doesn't show it for the first round.
        if(playCount >= 1 && playCount != simonePlay.length) {
            statusP.innerHTML = `So far so good! ${playCount} more to go!`
        }
        //waits on a string with the color the user selects which will be compared and if it is not the same end the game
        playerInput = await getPlayerInput();
        //play audio and change color back for playerInput
        if(playerInput == "B") {
            new Audio("sounds/blue.wav").play();
            await new Promise((resolve) =>
                setTimeout(() => {
                resolve(blueSquare.style.backgroundColor = "blue")
                }, 200)
            );
        }
        else if(playerInput == "R") {
            new Audio("sounds/red.wav").play();
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(redSquare.style.backgroundColor = "red")
                }, 200)
            );
        }
        else if(playerInput == "Y") {
            new Audio("sounds/yellow.wav").play();
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(yellowSquare.style.backgroundColor = "yellow");
                }, 200)
            );
        }
        else if(playerInput == "G") {
            new Audio("sounds/green.wav").play();
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve(greenSquare.style.backgroundColor = "green")
                }, 200)
            );
        }
        if(playerInput != simonePlay[i]) {
            return false;
        }
        //reset playerInput and update the playCount
        playerInput = "";
        playCount--;
    }
    //if it gets through the sequence at this round return true to get to next round (or end game)
    return true;
}

/**
 * This function waits for a button click from the user and based on that button click returns a string
 * of that color.
 * 
 * @returns an a string that holds what color corresponds to the users button press 
 */
async function getPlayerInput() {
    return await new Promise((resolve) => {
        //get a button press
        blueSquare.addEventListener("click", async () => {
            playerInput = "B";
            resolve(playerInput)
        }),
        redSquare.addEventListener("click", async () => {
            playerInput = "R";
            resolve(playerInput)
        }),
        
        yellowSquare.addEventListener("click", async () => {
            playerInput = "Y";
            resolve(playerInput)
        }),
        
        greenSquare.addEventListener("click", async () => {
            playerInput = "G";
            resolve(playerInput)
        });
    });
}

//run the start sequence
button.addEventListener("click", async () => {
    //run the start sequence
    await runStartSeq();
    //highlight the squares
    blueSquare.addEventListener("mouseover", () => {
        blueSquare.style.border = "thin solid white"
    });
    redSquare.addEventListener("mouseover", () => {
        redSquare.style.border = "thin solid white"
    });
    yellowSquare.addEventListener("mouseover", () => {
        yellowSquare.style.border = "thin solid white"
    });
    greenSquare.addEventListener("mouseover", () => {
        greenSquare.style.border = "thin solid white"
    });
    //remove highlights if mouse is moved off
    blueSquare.addEventListener("mouseout", () => {
        blueSquare.style.backgroundColor = "blue"
        blueSquare.style.border = "none"
    });
    redSquare.addEventListener("mouseout", () => {
        redSquare.style.backgroundColor = "red"
        redSquare.style.border = "none"
    });
    yellowSquare.addEventListener("mouseout", () => {
        yellowSquare.style.backgroundColor = "yellow"
        yellowSquare.style.border = "none"
    });
    greenSquare.addEventListener("mouseout", () => {
        greenSquare.style.backgroundColor = "green"
        greenSquare.style.border = "none"
    });
    //mouse down effects
    blueSquare.addEventListener("mousedown", async () => {
        blueSquare.style.backgroundColor = "lightblue";
    });   
    redSquare.addEventListener("mousedown", async () => {
        redSquare.style.backgroundColor = "hotpink";
    });   
    yellowSquare.addEventListener("mousedown", async () => {
        yellowSquare.style.backgroundColor = "lightyellow";
    });
    greenSquare.addEventListener("mousedown", async () => {
        greenSquare.style.backgroundColor = "lightgreen";
    });
    //mouse up effects
    blueSquare.addEventListener("mouseup", async () => {
        blueSquare.style.backgroundColor = "blue";
    });   
    redSquare.addEventListener("mouseup", async () => {
        redSquare.style.backgroundColor = "red";
    });   
    yellowSquare.addEventListener("mouseup", async () => {
        yellowSquare.style.backgroundColor = "yellow";
    });
    greenSquare.addEventListener("mouseup", async () => {
        greenSquare.style.backgroundColor = "green";
    });
    //wait 4 seconds after the start sequence to begin the first round
    await new Promise((resolve) =>
    setTimeout(() => {
        resolve();
    }, 4000)
    );
    //run the play sequence
    initPlaySeq(round_num);
});