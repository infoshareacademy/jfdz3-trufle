var random = Math.floor((Math.random() * 250) + 1); // random number from 1 to 250 (250 = all cuntires)
// random = 178; // index Polski
/** INIT Google Map 2 **/

function initMap() {

    var displayCountries2 = function (allCountries) {

        var countrie = allCountries.map(function (countrie) {
            return {
                code: countrie.numericCode,
                name: countrie.name,
                capitol: countrie.capital,
                population: countrie.population,
                latlng: countrie.latlng,
                shortName: countrie.alpha2Code,
                area: countrie.area
            }
        })

        var lat = countrie[random].latlng[0];
        var lng = countrie[random].latlng[1];
        var shortName = countrie[random].shortName;
        var area = countrie[random].area;
        var zoom;
        if (area < 5000) {
            zoom = 8;
        } else if (area < 20000) {
            zoom = 6;
        } else if (area < 100000) {
            zoom = 5;
        } else if (area < 700000) {
            zoom = 4;
        } else if (area < 1050000) {
            zoom = 3;
        }

        console.log(lat + ' ' + lng);
        console.log(area);
        console.log(zoom);

        var map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(lat, lng),
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var layer = new google.maps.FusionTablesLayer({
            query: {
                select: 'geometry',
                from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
                where: "ISO_2DIGIT IN ('" + shortName + "')"
            },
            map: map,
            suppressInfoWindows: true
        });
        layer.setMap(map);
    }
    /** INIT Google Map 2 END **/
    getAllCountriesFromApi(displayCountries2);
}

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

        // var random = Math.floor((Math.random() * 250) + 1); // random number from 1 to 250 (250 = all cuntires)
        var countrieQuest = countrie[random]; // random countrie to the game 178 = Poland index
        var population = countrieQuest.population; // select population of the countrieQuest

        console.log('code: ' + countrieQuest.code + '\nKraj: ' + countrieQuest.name + ' \nStolica:' + countrieQuest.capitol);

        $('#countryQuest').html(' ' + countrieQuest.name); // insert name of countrie
        minVal = Math.round(population / 1000) * 1000 / 10; // radnom MIN value of population to choose
        maxVal = Math.round(population / 1000) * 1000 * 3; //radnom MAX value of population to choose
        $('#myRange').attr('min', minVal); // add MIN value attribute to input.range
        $('#minPop').html(numeral(minVal).format('0,000.00a')); // display MIN value before input.range
        $('#myRange').attr('max', maxVal); // add MAX value attribute to input.range
        $('#maxPop').html(numeral(maxVal).format('0,000.00a')); // display MAX value before input.range

        console.log($('#myRange').attr('min'));
        console.log($('#myRange').attr('max'));


        minRightAnswer = population - (population / 100 * 20); // select MIN value to correct answer
        maxRightAnswer = population + (population / 100 * 20); // select MAX value to right answer
        console.log(minRightAnswer + ' - ' + population + ' - ' + maxRightAnswer); // display range of correct value


        /**displays current values selected**/
        $("#myRange").on('mousedown', function () {
            $("#myRange").on('mousemove', function () {
                $('#answer').html(numeral($(this).val()).format('0,000.00a'));
            })
        });


        /**************************
         ** CHECK CORRECT ANSWER **
         **************************/
        $('#ansBtn').click(function () {
            var answer = $('#myRange').val();
            if (answer > minRightAnswer && answer < maxRightAnswer) {
                console.log('DOBRZE!');
                alert('WYGRAŁEŚ!')

            } else {
                console.log('ŹLE!');
                alert('BUuu cienias!')
            }
        });
        /** CHECK CORRECT ANSWER **/


        /*        /!************************
         ***** GOOGLE  MAP ******
         ************************!/
         google.charts.load('upcoming', {'packages': ['geochart']});
         google.charts.setOnLoadCallback(drawRegionsMap);

         function drawRegionsMap() {

         var data = google.visualization.arrayToDataTable([
         ['Country', 'Population'],
         [countrieQuest.name, countrieQuest.population]
         ]);

         var options = {
         tooltip: {trigger: 'none'},
         legend: {textStyle: {fontSize: .1}}
         };

         var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

         chart.draw(data, options);
         }

         /!****** GOOGLE MAP END ******!/*/

        /** Google Map 2 **/
        $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKljXf4TroNrn0vwSpdLiC5bZF1htiO9Y&callback=initMap" async defer></script>');
        /** Google Map 2 END **/


    }; //end of displayCountries
    // initMap(50,20);
    getAllCountriesFromApi(displayCountries);
};
