// Make the page reload when it is reached via the back button
(function () {
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
})();

const flashcardsCategories = document.querySelector(".flashcards-categories");

// Creates and display catecories based on dictionary.js
function createCategory(word, score, listLength) {
    // Formats the dictionary's words
    let displayWord = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] == word[i].toUpperCase()) displayWord += " ";
        if (i === 0) {
            displayWord += word[i].toUpperCase();
        } else {
            displayWord += word[i];
        }
    }
    // Displays the catecories
    flashcardsCategories.innerHTML += `<a class="no-decoration" href="/apps/flashcards/${word}">
            <span class="large-text m-b-1">${displayWord}</span>
            <span id="${word}">Score: ${score}/${listLength}</span>
    </a>`;
}

// Calculate and display the score
for (const listName of Object.keys(dictionary)) {

    // const wordList = Object.keys(dictionary[listName])
    const wordList = dictionary[listName].map(entry => entry[1][0]);
    let score;

    if (!localStorage.getItem(listName)) {
        score = 0;
    } else {
        const guessedWords = JSON.parse(localStorage.getItem(listName))
        const unguessedWords = [];
        for (const word of wordList) {
            if (!guessedWords.includes(word)) unguessedWords.push(word)
        }
        score = wordList.length - unguessedWords.length;
    }

    createCategory(listName, score, wordList.length)
}