/*
 * main.js
 *
 * Comp20 - Sp2021
 * Amy Bui
 * 3/4/2021
 * 
 * Simulate Mass Lottery's Luck For Life.
 * Determines if user's guessed numbers matched randomly generated set.
 * Assumes all inputs are valid. Like the game, you get one chance to guess
 * (but you can refresh the page to play again).
 * 
 */

// main driver
function main() {

// Constants
const PLAY_NUMS   = 5;
const GAME_RANGE  = 48;
const LUCKY_RANGE = 18;


/***********************************************************************
                            FUNCTIONS
***********************************************************************/
// returns a number in the range of 1 to limit
function getNumUpTo(limit) { return Math.floor((Math.random() * limit) + 1) }

// returns true if num is in range from 1 to limit
function inRange(num, limit) { 
    return (num >= 1 && num <= limit) ? true : false; 
}

// Helper function to help sort arrays in ascending order
function ascendSort(a,b) {return a - b}

/*
 * Display the numbers of the Game. 
 * Writes to the html file, putting in the numbers 
 * to tags with id idName as string. gameArr expected to be size 5, 
 * containing the first 5 numbers of the lottery game. lucky is expected
 * to be the 6th additional number for the Lucky Ball number.
 */
function displayGameNumbers(idName, gameArr, lucky) {
    let ul = document.querySelector(idName);
    for (let i = 0; i < PLAY_NUMS + 1; i++) {
        let li = document.createElement('li');
        if (i == PLAY_NUMS) {
            li.innerHTML = lucky;
        } else {
            li.innerHTML = gameArr[i];
        }
        ul.appendChild(li);
    }
}

// looks for element elem in array arr. Returns true if found.
function matchFound(elem, arr) { return arr.includes(elem); } 
/***********************************************************************/

/***********************************************************************
                            PLAY GAME
***********************************************************************/
/*
 * Generate 5 random numbers for game. No duplicates.
 */
LottoNums = new Array;
for (let i = 0; i < PLAY_NUMS + 1; i++) {
    num = getNumUpTo(GAME_RANGE);
    while (LottoNums.includes(num)) {   // check for duplicates
        num = getNumUpTo(GAME_RANGE);
    }
    LottoNums.push(num);
}
LottoNums.sort(ascendSort);

/*
 * Generate the Lucky Ball Number. No duplicates from previous list.
 */
LuckyBall = getNumUpTo(LUCKY_RANGE);
while (LottoNums.includes(LuckyBall)) {   // check for duplicates
    LuckyBall = getNumUpTo(LUCKY_RANGE);
}

/*
 * Prompt user for their number guesses.
 * Note: Expected input are 5 initial gueses (integers), separated 
 * by white space, and one extra Lucky Ball guess. 
 */
UserNums = new Array;
let validNums = true;

do {
    validNums = true;
    let input = prompt("Please enter your 5 number guesses, " +
                        "separated by spaces. [1,48]", "");
    
    let inputArr = input.split(" ", 5);

    inputArr.forEach(parseNum);
    function parseNum(item, index, arr) {
        arr[index] = parseInt(item, 10);
    }

    // Ensure range of numbers [1,48]
    inputArr.forEach(enforceRange);
    function enforceRange(item, index, arr) {
        if (!inRange(item, GAME_RANGE)) { validNums = false;}
    }

    if (!validNums || inputArr.length < 5) {
        alert("Please enter numbers between 1 and 48, inclusive.");
        validNums = false;
    } else { UserNums = inputArr;}

} while (!validNums);

UserNums.sort(ascendSort);

let UserLuckyGuess;
do {
    validNums = true;
    let input = parseInt(prompt("Please enter your one " +
                                "lucky number guess. [1,18]", "0"));
    
    if (!inRange(input, LUCKY_RANGE)) { validNums = false;}

    if (!validNums) {
        alert("Please enter a number between 1 and 18, inclusive.");
    } else { UserLuckyGuess = input;}
    
} while (!validNums);
/***********************************************************************/


/***********************************************************************
                        CALCULATE RESULTS
***********************************************************************/
/*
 * Look for matches in the first 5 numbers 
 */
// Eliminate user's duplicates
let uniqueNums = new Array;
UserNums.forEach(filterDup);
function filterDup(item) {
    if (!uniqueNums.includes(item)) {
        uniqueNums.push(item);
    }
}
// count the matches
let matches = 0;
uniqueNums.forEach(findMatchFor);
function findMatchFor(item) {
    if (matchFound(item, LottoNums)) {
        matches += 1;
    }
}


/*
 * Look for match with Lucky Ball Number
 */
let luckyMatch = (UserLuckyGuess == LuckyBall) ? true : false;


/*
 * Payout calculator
 * Reference the assignment handout.
 */
let payout = 0;
if      (matches == 0 && luckyMatch)    { payout = 4; }
else if (matches == 1 && luckyMatch)    { payout = 6; }
else if (matches == 2 && !luckyMatch)   { payout = 3; }
else if (matches == 2 && luckyMatch)    { payout = 25; }
else if (matches == 3 && !luckyMatch)   { payout = 20; }
else if (matches == 3 && luckyMatch)    { payout = 150; }
else if (matches == 4 && !luckyMatch)   { payout = 200; }
else if (matches == 4 && luckyMatch)    { payout = 5000; }
else if (matches == 5 && !luckyMatch)   { payout = 25000; }
else if (matches == 5 && luckyMatch)    { payout = 7000; }
/***********************************************************************/


/*************************************************************
                    DISPLAY RESULTS TO SCREEN
**************************************************************/
displayGameNumbers("#display-winning-nums", LottoNums, LuckyBall);
displayGameNumbers("#display-user-nums", UserNums, UserLuckyGuess);



let showMatches = document.querySelector("#general-matching");
showMatches.innerHTML = `You got ${matches} number(s) matching`;

let finalMatch = document.querySelector("#lucky-match");
let colorMatch = document.querySelector("#display-user-nums").lastElementChild;
console.log(colorMatch.style.backgroundColor);
if (luckyMatch) { 
    finalMatch.innerHTML = "You matched the Lucky Ball!";
    colorMatch.style.backgroundColor = '#008000';
} else {
    finalMatch.innerHTML = "You did not match the Lucky Ball";
    colorMatch.style.backgroundColor = '#ff0000';
    colorMatch.style.border = '2px solid #f00';
}

let displayPayout = document.querySelector("#display-payout");
if (payout == 0) {
    displayPayout.innerHTML = "Sorry. You did not win any prizes.";
} else {
    displayPayout.innerHTML = "Congratulations! ";
    if (payout == 25000) {
        displayPayout.innerHTML = `You\'ve won ${payout} a YEAR for LIFE!`;
    } else if (payout == 7000) {
        displayPayout.innerHTML = `You\'ve won ${payout} a WEEK for LIFE!`;
    } else {
        displayPayout.innerHTML = `You\'ve won ${payout}!`;
    }
}

// Show results, and hide the prompt
document.querySelector('#number-balls').style.display = 'flex';
document.querySelector('#results').style.display = 'flex';
document.querySelector('#prompter').style.display = 'none';


} // END OF MAIN