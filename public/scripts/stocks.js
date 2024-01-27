const baseUrl = "http://localhost:3000/";

const input = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");
const searchOutcome = document.querySelector("#search-outcome");
const modal = document.querySelector("#modal");
const close = document.querySelector("#close");
const getDataBtn = document.querySelector("#get-data");
const companyId = document.querySelector("#company-id");
const ctx = document.querySelector("#myChart");
const timeModal = document.querySelector("#time-modal");
const timeCloseBtn = document.querySelector("#time-close");
const start = document.querySelector("#start");
const end = document.querySelector("#end");
const updateTimeBtn = document.querySelector("#update-time");

let listOfCompanies = [];
let dateStyle = 0;
const oneYear = 31536000000;
let maxTicks = 6;
let companyInfo;

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
function radioFinder(radiosClass) {
    let chosenRadio;
    document.querySelectorAll(radiosClass).forEach(element => {
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
                    name="chosen-company"> ${element[1]} <strong>(${element[0]})</strong></label>`
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

function getData() {
    // Prevent the refreshing of the page
    // event.preventDefault()

    // Finds out what the user's choice was (Which radio button is checked)
    const usersChoice = radioFinder(".available-choices")
    console.log(usersChoice);
    const listOfLabels = [];
    const closingPrice = [];
    let codeTraversedSafely = true;

    postRequest("choices", usersChoice)
        .then(getRequest("information")
            .then((result) => {

                try {
                    companyInfo = Object.entries(result.information["Weekly Adjusted Time Series"])
                    let time = new Date().getTime();
                    let setDate = time - (oneYear * 6 / 52)

                    companyInfo.forEach(([key, value]) => {
                        let keyDate = new Date(key).getTime();

                        if (keyDate > setDate) {
                            listOfLabels.unshift(key);
                            closingPrice.unshift(value["5. adjusted close"]);
                        }
                    });

                    companyId.innerHTML = usersChoice;
                    updateChart(stocksChart, listOfLabels, closingPrice);
                } catch (error) {
                    codeTraversedSafely = false;
                }

                cleanUp()

            })
        )
}








function changeTimeSpan(start, end) {
    const listOfLabels = [];
    const closingPrice = [];

    // Grab the start and end dates
    let selectedStartDate = new Date(start).getTime()
    let selectedEndDate = new Date(end).getTime()

    ticksCalculator((selectedEndDate - selectedStartDate))
    stocksChart.config.options.scales.x.ticks.maxTicksLimit = maxTicks;

    // If a record falls in between the start and end dates we select it to be displayed
    companyInfo.forEach(([key, value]) => {
        let keyDate = new Date(key).getTime();

        if ((keyDate >= selectedStartDate) && (keyDate <= selectedEndDate)) {
            listOfLabels.unshift(key);
            closingPrice.unshift(value["5. adjusted close"]);
        }
    });

    // If the number of records is more than a 1000, it is brought down to 1000 by deleting some records
    // if (listOfLabels.length > 1000) {
    //     let temporaryListOfLabels = [];
    //     let temporaryClosingPrice = [];
    //     let count = 0;
    //     let factor = 1000 / listOfLabels.length;
    //     listOfLabels.forEach((element, index) => {
    //         let factoredIndex = index * factor;
    //         if (factoredIndex >= count) {
    //             temporaryListOfLabels.push(element);
    //             temporaryClosingPrice.push(closingPrice[index]);
    //             count++
    //         }
    //     })
    //     console.log(temporaryListOfLabels.length);
    //     console.log(temporaryClosingPrice.length);
    //     listOfLabels = temporaryListOfLabels;
    //     closingPrice = temporaryClosingPrice;
    // }

    // Update the chart
    updateChart(stocksChart, listOfLabels, closingPrice);
}














// Updates the chart
async function updateChart(theChart, theLabel, theData) {
    theChart.data.labels = theLabel;
    theChart.data.datasets[0].data = theData;
    theChart.update();
}



searchBtn.addEventListener("click", matchingCompanies);
close.addEventListener("click", cleanUp);
getDataBtn.addEventListener("click", getData)



// Change date style
// dateStyle = (setDate <= (oneYear * 2.5)) ?
//     ((setDate <= (oneYear * 2 / 12)) ? dateStyle = 0 : dateStyle = 1) : dateStyle = 2;


function ticksCalculator(timePeriod) {
    let timeFraction = timePeriod / 6;
    let timeFractionMltp;

    if (timeFraction >= oneYear) {
        coeffcient = timeFraction / oneYear;
        flooredCoeffcient = Math.floor(coeffcient);
        if (coeffcient !== flooredCoeffcient) coeffcient = flooredCoeffcient + 1;
        timeFractionMltp = coeffcient * oneYear;

    } else if (timeFraction >= (oneYear / 12)) {
        coeffcient = timeFraction / (oneYear / 12);
        flooredCoeffcient = Math.floor(coeffcient);
        if (coeffcient !== flooredCoeffcient) coeffcient = flooredCoeffcient + 1;
        timeFractionMltp = coeffcient * (oneYear / 12);

    } else {
        coeffcient = timeFraction / (oneYear / 52);
        flooredCoeffcient = Math.floor(coeffcient);
        if (coeffcient !== flooredCoeffcient) coeffcient = flooredCoeffcient + 1;
        timeFractionMltp = coeffcient * (oneYear / 52);
    }

    maxTicks = Math.floor(timePeriod / timeFractionMltp);
}

ticksCalculator((oneYear * 6 / 52))


function dateStyleFormatter(label) {
    let day = label.slice(8, 10);
    const month = label.slice(5, 7);
    const year = label.slice(0, 4);
    let shortWordMonth;

    switch (month) {
        case "01": shortWordMonth = "Jan"; break;
        case "02": shortWordMonth = "Feb"; break;
        case "03": shortWordMonth = "Mar"; break;
        case "04": shortWordMonth = "Apr"; break;
        case "05": shortWordMonth = "May"; break;
        case "06": shortWordMonth = "Jun"; break;
        case "07": shortWordMonth = "Jul"; break;
        case "08": shortWordMonth = "Aug"; break;
        case "09": shortWordMonth = "Sep"; break;
        case "10": shortWordMonth = "Oct"; break;
        case "11": shortWordMonth = "Nov"; break;
        case "12": shortWordMonth = "Dec"; break;
        default: break;
    }

    if (dateStyle === 0) {
        return `${day} ${shortWordMonth} ${year}`;
    } else if (dateStyle === 1) {
        return `${shortWordMonth} ${year}`;
    } else if (dateStyle === 2) {
        return year;
    }
}






// CHART.JS's script
let stocksChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: null,
        datasets: [
            {
                label: 'Adjusted Weekly Closing Price',
                data: null,
                pointRadius: 0,
                borderWidth: 1,
            },
        ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,

        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: maxTicks,
                    callback: function (val) {
                        const label = this.getLabelForValue(val);
                        return dateStyleFormatter(label);
                    },
                    color: 'red',
                }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    maxTicksLimit: 10,
                    callback: value => `$${value}`
                },
            }
        }
    }
});