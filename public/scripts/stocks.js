const baseUrl = "http://localhost:3000/";

const input = document.querySelector("#searched-company");
const searchBtn = document.querySelector("#search");
const searchOutcome = document.querySelector("#search-outcome");
const modal = document.querySelector("#modal");

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

// Updates the chart
// async function updateChartData(theChart, theLabel, theData) {
//     theChart.data.labels = theLabel;
//     theChart.data.datasets[0].data = theData;
//     theChart.update();
// }






// Finds which companies match the user's search phrases
function matchingCompanies() {
    // Prevent the refreshing of the page
    // event.preventDefault()

    let cleanedInput = input.value.trim()
    // searchModal.css("display", "block");

    // If the user inputs an empty string then we display an invalid input, otherwise we start the search
    if (cleanedInput.length > 0) {
        // Creates a loading screen
        // matchingCompanies.html(loading);

        if (listOfCompanies.length < 1) {
            // Get hold of the matching results
            getRequest("options").then(function (result) {

                listOfCompanies = result.options;
                searchOutcome.innerHTML = listOfCompanies;
                console.log(listOfCompanies);
                // displayAvailableCompanies();
            });
        } else {
            // displayAvailableCompanies();
            console.log(listOfCompanies);
        }
    } else {
        console.log("No input");
        searchOutcome.innerHTML = "No input was provided!";
        // matchingCompanies.html('<span>Please type in the name of the company or #ticker-symbol on the serach bar before you hit the search button.</span>');
    }
}



searchBtn.addEventListener("click", matchingCompanies)









// Displays what companies are available, if none are, it displays a message informing the user
// function displayAvailableCompanies() {
//     let matches = "";

//     // If the the input starts with "#", then we search by ticker symbol, otherwise we search by name
//     if (input.value[0] === "#") {
//         listOfCompanies.forEach(element => {
//             let companyTickerSymbol = "#" + element[0];
//             if (companyTickerSymbol.toLowerCase() === input.value.toLowerCase()) {
//                 matches += `<input type="radio" class="available-choices" id="${element[0]}" name="chosen-company">
//                     <label class="available-choices-label" for="${element[0]}">${element[1]}</label>
//                     <br>`
//             }
//         });
//     } else {
//         listOfCompanies.forEach(element => {
//             if (element[1].toLowerCase().includes(input.value.toLowerCase())) {
//                 matches += `<input type="radio" class="available-choices" id="${element[0]}" name="chosen-company">
//                     <label class="available-choices-label" for="${element[0]}">${element[1]} <strong>(${element[0]})</strong></label>
//                     <br>`
//             }
//         });
//     }

//     // If no matches were found we display this screen
//     if (matches === "") {
//         matches = '<span class="fs-4">Sorry, no results found.</span>';
//     } else {
//         getData.css("display", "block");
//     }

//     // searchModal.css("display", "block");
//     matchingCompanies.html(matches);
// }