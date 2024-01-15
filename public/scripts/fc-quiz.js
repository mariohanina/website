const wordCategory = dictionary[urlParam];
const wordList = Object.keys(dictionary[urlParam]);
const unwatedLetters = ["?", "!", " / ", "/ ", " /", "/", "-"];

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


function randomNum() {
    let temp = Math.floor(Math.random() * unguessed.length);
    if (temp === randomNumber && unguessed.length > 1) {
        randomNum();
    } else {
        randomNumber = temp;
    }
}

function seperateWords() {
    unguessed = [];
    for (const word of wordList) {
        if (!guessed.includes(word)) unguessed.push(word);
    }
}

function calculateScore() { score = wordList.length - unguessed.length; }
function updateQuestion(content) { question.textContent = content; }
function updateAnswer(misspelledWord) { answer.textContent = misspelledWord; }
function updateScore() { htmlScore.textContent = `Score: ${score}/${wordList.length}`; }

function wordCleaner(word, letters) {
    let output = word.toLowerCase().trim();
    letters.forEach(letter => { output = output.replaceAll(letter, " ") });
    return output.trim();
}

function typoDetector(userInput, cleanedAnswerList, answerList) {
    let condition = false;
    let accuracy = 0;
    let misspelledWord = answerList[0];

    cleanedAnswerList.forEach((element, index) => {
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
                return;
            }
        }
    })

    return [condition, accuracy, misspelledWord];
}

function flipCard(degree) {
    card.style.transform = `rotateY(${degree}deg)`;
}

function checkAnswer() {

    if (unguessed.length === 0) {
        modal.style.display = "flex";
    } else {
        removeEvents();
        const answerList = wordCategory[unguessed[randomNumber]];
        const cleanedAnswerList = answerList.map((word) => wordCleaner(word, unwatedLetters));
        const cleanedUserInput = wordCleaner(userInput.value, unwatedLetters);
        const [condition, accuracy, misspelledWord] = typoDetector(cleanedUserInput, cleanedAnswerList, answerList);

        if (condition) {
            if (accuracy < 1) {
                message.textContent = "The correct spelling is: " + misspelledWord;
            } else {
                message.textContent = "Perfect!"
            }
            guessed.push(unguessed[randomNumber]);
            seperateWords();
            localStorage.setItem(urlParam, JSON.stringify(guessed));
            updateAnswer(misspelledWord);
            calculateScore();
            updateScore();
            cardBack.style.backgroundColor = "#3D664B";
            flipCard(180);
        } else {
            message.textContent = "Wrong Answer!";
            updateAnswer(misspelledWord);
            cardBack.style.backgroundColor = "#99352E";
            flipCard(180)
        }
    }

}

function procceed() {
    if (unguessed.length === 0) {
        addEvents();
        userInput.value = "";
        setTimeout(() => {
            message.textContent = "";
            cardBack.style.backgroundColor = "var(--main-theme-color)";
        }, 200);

        updateQuestion("Game Over!");
        flipCard(0);
        // modal.style.display = "flex";
    } else {
        // Reset everything
        addEvents();
        userInput.value = "";
        setTimeout(() => {
            message.textContent = "";
            cardBack.style.backgroundColor = "var(--main-theme-color)";
        }, 200);

        randomNum();
        updateQuestion(unguessed[randomNumber]);
        flipCard(0);
    }
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
    seperateWords();
    localStorage.setItem(urlParam, JSON.stringify(guessed));
    randomNum();
    updateQuestion(unguessed[randomNumber]);
    calculateScore();
    updateScore();
}

function removeEvents() {
    checkAnswerButton.style.opacity = "0.3";
    revealButton.style.opacity = "0.3";
    resetButton.style.opacity = "0.3";
    checkAnswerButton.removeEventListener("click", checkAnswer);
    revealButton.removeEventListener("click", revealAnswer);
    resetButton.removeEventListener("click", resetProgress);
}

function addEvents() {
    checkAnswerButton.style.opacity = "1";
    revealButton.style.opacity = "1";
    resetButton.style.opacity = "1";
    checkAnswerButton.addEventListener("click", checkAnswer);
    revealButton.addEventListener("click", revealAnswer);
    resetButton.addEventListener("click", resetProgress);
}


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
close.addEventListener("click", () => { modal.style.display = "none"; })