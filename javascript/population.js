/*------------------------The Game------------------------*/
window.onload = function () {
    var displayCountries = function (allCountries) {
        // run game and create forms
        console.log("First country:" + allCountries[0].name);
        console.dir(allCountries);

        var countrie = allCountries.map(function (countrie) {
            return {
                code: countrie.numericCode,
                name: countrie.name,
                capitol: countrie.capital,
                population: countrie.population
            }
        })

        $("input").prop('disabled', false); // disabel input.range before load data

        var random = Math.floor((Math.random() * 250) + 1); // random number from 1 to 250 (250 = all cuntires)
        var countrieQuest = countrie[48]; // random countrie to the game 178 = Poland index
        var population = countrieQuest.population; // select population of the countrieQuest

        console.log(population);
        var poland = countrie.filter(function( obj ) {
            return obj.name == 'Poland';
        });
        console.log('code: ' + countrieQuest.code + '\nKraj: ' + countrieQuest.name + ' \nStolica:' + countrieQuest.capitol);

        $('#countryQuest').html(' ' + countrieQuest.name); // insert name of countrie
        minVal = Math.round(population/1000)*1000/10; // radnom MIN value of population to choose
        maxVal = Math.round(population/1000)*1000*3; //radnom MAX value of population to choose
        $('#myRange').attr('min', minVal); // add MIN value attribute to input.range
        $('#minPop').html(numeral(minVal).format('0,000.00a')); // display MIN value before input.range
        $('#myRange').attr('max', maxVal); // add MAX value attribute to input.range
        $('#maxPop').html(numeral(maxVal).format('0,000.00a')); // display MAX value before input.range

        console.log($('#myRange').attr('min'));
        console.log($('#myRange').attr('max'));


        minRightAnswer = population - (population/100*20); // select MIN value to correct answer
        maxRightAnswer = population + (population/100*20); // select MAX value to right answer
        console.log(minRightAnswer + ' - ' + population + ' - ' + maxRightAnswer); // display range of correct value


        /**displays current values selected**/
        $("#myRange").on('mousedown', function() {
            $("#myRange").on('mousemove', function () {
                $('#answer').html(numeral($(this).val()).format('0,000.00a'));
            })
        });


        /**************************
         ** CHECK CORRECT ANSWER **
         **************************/
        $('#ansBtn').click(function () {
            var answer = $('#myRange').val();
            if (answer > minRightAnswer && answer < maxRightAnswer){
                console.log('DOBRZE!');
                alert('WYGRAŁEŚ!')

            }else {
                console.log('ŹLE!');
                alert('BUuu cienias!')
            }
        });
        /** CHECK CORRECT ANSWER **/


        /************************
         ***** GOOGLE  MAP ******
         ************************/
        google.charts.load('upcoming', {'packages':['geochart']});
        google.charts.setOnLoadCallback(drawRegionsMap);

        function drawRegionsMap() {

            var data = google.visualization.arrayToDataTable([
                ['Country', 'Population'],
                [countrieQuest.name, countrieQuest.population]
            ]);

            var options = {};

            var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

            chart.draw(data, options);
        }
        /****** GOOGLE  MAP END ******/
    }; //end of displayCountries

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