window.onload = function () {
    var displayCountries = function (allCountries) {
        // run game and create forms
        console.log("First country:" + allCountries[0].name);
        console.dir(allCountries);

        var countrie = allCountries.map(function (countrie) {
            return {
                name: countrie.name,
                capitol: countrie.capital,
                population: countrie.population
            }
        })

        var random = Math.floor((Math.random() * 250) + 1);
        console.log(countrie[random].population);

        document.querySelector('#myRange').addEventListener('change', showDivs);
        function showDivs(event) {
            console.log(event)
        }

        // countrie.forEach(function (element) {
        //     if (element.population == 0)
        //     console.log(element);
        // })
        // console.log(Math.floor((Math.random() * 250) + 1));

    };

    getAllCountriesFromApi(displayCountries);
};

function getAllCountriesFromApi(callback) {
    var allCountries = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            allCountries = JSON.parse(this.responseText);
            callback(allCountries);
        }
    };
    xhttp.open("GET", "https://restcountries.eu/rest/v1/all", true);
    xhttp.send() ;
}