//query selectors
let round_count = document.querySelector("#rounds");
let button = document.querySelector("#play");
let blueSquare = document.querySelector("#blueSq")
let redSquare = document.querySelector("#redSq")
let greenSquare = document.querySelector("#greenSq")
let yellowSquare = document.querySelector("#yellowSq")
let statusP = document.querySelector("#status")
let background = document.querySelector("body")
let colors = document.querySelector("div")
//values to be stored
let round_num = 10;
let playerInput = "";

//get the start sequence
async function getStartSequence() {
    try {
        const hdrs = {
            headers: { Accept: "application/json"}
        }
        //get the start seq
        let test = await axios.get("http://cs.pugetsound.edu/~dchiu/cs240/api/simone/?cmd=start", hdrs);
        return test.data.sequence
    } catch(err) {
        return "error!"
    }
}

//get the play sequence
async function getPlaySequence(rounds) {
    try {
        const hdrs = {
            headers: { Accept: "application/json"}
        }
        //get the play seq with rounds
        let test = await axios.get(`http://cs.pugetsound.edu/~dchiu/cs240/api/simone/?cmd=getSolution&rounds=${rounds}`, hdrs);
        return test.data.key;
    } catch(err) {
        return "error!";
    }
}

//change value of round number if the input is changed
round_count.addEventListener("input", () => {
    round_num = round_count.value;
});