const wordCategory = dictionary[urlParam];
const wordList = Object.keys(dictionary[urlParam]);
const unwatedLetters = ["?", "!", " / ", "/ ", " /", "/", "-", "the "];

const htmlScore = document.querySelector("#score");
const question = document.querySelector("#question");
const userInput = document.getElementById("user-input");
const answer = document.querySelector("#answer");
const message = document.querySelector("#message");
const continueButton = document.querySelector("#continue");
const card = document.querySelector(".card-inner");
const cardBack = document.querySelector(".card-back");
const checkAnswerButton = document.querySelector("#check-answer");
const revealButton = document.querySelector("#reveal");
const resetButton = document.querySelector("#reset");
const modal = document.querySelector("#modal");
const close = document.querySelector("#close");

let guessed = localStorage.getItem(urlParam) ? JSON.parse(localStorage.getItem(urlParam)) : [];
let unguessed = [];
let score = 0;
let randomNumber = 0;

// GENERATE A RANDOM NUMBER
function randomNum() {
    let temp = Math.floor(Math.random() * unguessed.length);
    if (temp === randomNumber && unguessed.length > 1) {
        randomNum();
    } else {
        randomNumber = temp;
    }
}

// SEPERATE GUESSED WORDS FROM UNGUESSED ONES
function seperateWords() {
    unguessed = [];
    for (const word of wordList) {
        if (!guessed.includes(word)) unguessed.push(word);
    }
}

// CALCULATE THE SCORE
function calculateScore() { score = wordList.length - unguessed.length; }
// UPDATE THE SCORE ON THE WEBSITE
function updateScore() { htmlScore.textContent = `Score: ${score}/${wordList.length}`; }
// UPDATE THE HTML QUESTION ELEMENT
function updateQuestion(content) { question.textContent = content; }
// UPDATE THE HTML ANSWER ELEMENT
function updateAnswer(content) { answer.textContent = content; }

// REMOVE UNWANTED CHARACTERS FROM THE WORDS SUCH AS ?, -, AND /
function wordCleaner(word, letters) {
    let output = word.toLowerCase().trim();
    letters.forEach(letter => {
        console.log("output before: " + output);
        output = output.replaceAll(letter, " ")
        console.log("output after: " + output);
    });
    return output.trim();
}

// FIND OUT IF THE ANSWER IS CORRECT AND DETECT MINOR TYPOES
function typoDetector(userInput, cleanedAnswerList, answerList) {
    let condition = false;
    let accuracy = 0;
    let misspelledWord = answerList[0];

    for (const [index, element] of cleanedAnswerList.entries()) {
        const elementLength = element.length;
        if (userInput.length === elementLength) {
            let count = 0;
            for (let index = 0; index < elementLength; index++) {
                if (userInput[index] === element[index]) count++;
            }
            accuracy = count / elementLength;

            if (accuracy >= 0.9) {
                misspelledWord = answerList[index];
                condition = true;
                break;
            }
        }
    }

    return [condition, accuracy, misspelledWord];
}

// CARD FLIPPING ANIMATION
function flipCard(degree) {
    card.style.transform = `rotateY(${degree}deg)`;
}

// CHECK IF ANSWER IS CORRECT
function checkAnswer() {
    if (unguessed.length === 0) {
        modal.style.display = "flex";
    } else {
        removeEvents();

        const answerList = wordCategory[unguessed[randomNumber]];
        const cleanedAnswerList = answerList.map((word) => wordCleaner(word, unwatedLetters));
        const cleanedUserInput = wordCleaner(userInput.value, unwatedLetters);
        const [condition, accuracy, misspelledWord] =
            typoDetector(cleanedUserInput, cleanedAnswerList, answerList);

        if (condition) {
            // If user answered correctly, save their progress and update the screen
            guessed.push(unguessed[randomNumber]);
            localStorage.setItem(urlParam, JSON.stringify(guessed));
            seperateWords();
            calculateScore();

            message.textContent = accuracy < 1 ?
                `Tiny mistake! You typed: "${userInput.value}"` : "Perfect!";
            updateAnswer(misspelledWord);
            updateScore();
            cardBack.style.backgroundColor = "#3D664B";

            flipCard(180);
        } else {
            // Otherwise, notify them, and update the screen.
            message.textContent = userInput.value === "" ?
                `You didn't type anything!` : `Wrong answer! You typed: "${userInput.value}"`;
            updateAnswer(misspelledWord);
            cardBack.style.backgroundColor = "#99352E";

            flipCard(180);
        }
    }

}

// RESET THE CARD AND NOTIFY THE USER OF THE NEXT PHASE IN THE GAME
function procceed() {
    addEvents();

    userInput.value = "";
    setTimeout(() => {
        message.textContent = "";
        cardBack.style.backgroundColor = "var(--main-theme-color)";
    }, 200);

    if (unguessed.length === 0) {
        updateQuestion("Game Over!");
    } else {
        randomNum();
        updateQuestion(unguessed[randomNumber]);
    }
    flipCard(0);
}

function revealAnswer() {
    if (unguessed.length > 0) {
        updateAnswer(wordCategory[unguessed[randomNumber]][0]);
        removeEvents();
        flipCard(180);
    }
}

function resetProgress() {
    guessed = [];
    localStorage.setItem(urlParam, JSON.stringify(guessed));
    seperateWords();
    calculateScore();
    randomNum();
    updateQuestion(unguessed[randomNumber]);
    updateScore();
}

// ADD ALL EVENTS AND MAKE THEM CLEARLY VISIBLE
function addEvents() {
    checkAnswerButton.style.opacity = "1";
    revealButton.style.opacity = "1";
    resetButton.style.opacity = "1";
    checkAnswerButton.addEventListener("click", checkAnswer);
    revealButton.addEventListener("click", revealAnswer);
    resetButton.addEventListener("click", resetProgress);
}

// REMOVE ALL EVENTS AND MAKE THEM TRANSLUCENT
function removeEvents() {
    checkAnswerButton.style.opacity = "0.3";
    revealButton.style.opacity = "0.3";
    resetButton.style.opacity = "0.3";
    checkAnswerButton.removeEventListener("click", checkAnswer);
    revealButton.removeEventListener("click", revealAnswer);
    resetButton.removeEventListener("click", resetProgress);
}

// START UP THE GAME
seperateWords();
calculateScore();

if (unguessed.length > 0) {
    randomNum();
    updateQuestion(unguessed[randomNumber]);
    updateScore();
} else {
    updateScore();
    updateQuestion("Game Over!");
    modal.style.display = "flex";
}

addEvents();
continueButton.addEventListener("click", procceed);
close.addEventListener("click", () => { modal.style.display = "none"; });


(function () {
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
})();