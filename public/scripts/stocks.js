const baseUrl = "http://localhost:3000/";

const input = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");
const searchOutcome = document.querySelector("#search-outcome");
const modal = document.querySelector("#modal");
const close = document.querySelector("#close");
const getDataBtn = document.querySelector("#get-data");

let listOfCompanies = [];

// Makes a get request
async function getRequest(path) {
    const res = await fetch((baseUrl + path), { method: "GET" });
    const data = await res.json();
    return data;
}

// Makes a post request
async function postRequest(path, parcel) {
    const res = await fetch(baseUrl + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcel: parcel })
    })
}

// Finds out which radio button is checked and returns it
function radioFinder(radios) {
    let chosenRadio;
    document.querySelectorAll(radios).forEach(element => {
        if (element.checked) chosenRadio = element.id;
    });
    return chosenRadio;
}

// Finds which companies match the user's search phrases
function matchingCompanies() {
    modal.style.display = "flex";
    let cleanedInput = input.value.trim();

    if (cleanedInput.length > 0) {
        // ADD A LOADING SCREEN
        if (listOfCompanies.length < 1) {
            getRequest("options").then(function (result) {
                listOfCompanies = result.options;
                displayAvailableCompanies();
            });
        } else {
            displayAvailableCompanies();
        }
    } else {
        searchOutcome.innerHTML = `<span class="large-text">You didn't type anything!</span>`;
    }
}

// Displays what companies are available, if none are, it displays a message informing the user
function displayAvailableCompanies() {

    let matches = "";

    // If the the input starts with "#", then we search by ticker symbol, otherwise we search by name
    if (input.value[0] === "#") {
        listOfCompanies.forEach(element => {
            let companyTickerSymbol = "#" + element[0];
            if (companyTickerSymbol.toLowerCase() === input.value.toLowerCase()) {
                matches += `<label class="available-choices-label" for="${element[0]}">
                    <input class="available-choices" type="radio" id="${element[0]}" 
                        name="chosen-company"> ${element[1]}</label>`
            }
        });
    } else {
        listOfCompanies.forEach(element => {
            if (element[1].toLowerCase().includes(input.value.toLowerCase())) {
                matches += `<label class="available-choices-label" for="${element[0]}">
                <input class="available-choices" type="radio" id="${element[0]}" 
                    name="chosen-company"> ${element[1]} <strong>(${element[0]})</strong></label>`
            }
        });
    }

    // If no matches were found we display this screen
    if (matches === "") {
        matches = '<span class="large-text">Sorry, no results found.</span>';
    } else {
        getDataBtn.style.display = "block";
    }

    searchOutcome.innerHTML = matches;
}

function cleanUp() {
    input.value = "";
    searchOutcome.innerHTML = "";
    getDataBtn.style.display = "none";
    modal.style.display = "none";
}

// Updates the chart
// async function updateChartData(theChart, theLabel, theData) {
//     theChart.data.labels = theLabel;
//     theChart.data.datasets[0].data = theData;
//     theChart.update();
// }



searchBtn.addEventListener("click", matchingCompanies);
close.addEventListener("click", () => cleanUp());