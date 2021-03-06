/**
 * Created by piotrlyczko on 29.01.17.
 */
/**
 * Created by piotrlyczko on 29.01.17.
 */

        function initMap() {

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

                // console.log(lat + ' ' + lng);
                // console.log(area);
                // console.log(zoom);

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

            /** INIT Google Map 2 END **/
        }

var countrie, random;

$('#reloadQuestion').click(function () {
    $('#correct').hide();
    $('#countrieData').hide();
    $('#wrong').hide();
    startQuiz();
})

function startQuiz() {
    $.ajax({
        url: "https://restcountries.eu/rest/v1/all",
        success: function (allCountries) {


            // console.log(allCountries[0].name);


            countrie = allCountries.map(function (countrie) {
                return {
                    code: countrie.numericCode,
                    name: countrie.name,
                    capitol: countrie.capital,
                    population: countrie.population,
                    latlng: countrie.latlng,
                    shortName: countrie.alpha2Code,
                    area: countrie.area,
                    phoneCode: countrie.callingCodes,
                    region: countrie.region,
                    nameTranslations: countrie.translations,
                    borders: countrie.borders,
                    nativeName: countrie.nativeName,
                    currencies: countrie.currencies,
                    languages: countrie.languages
                }
            })

            // console.log(countrie[0]);
            $("input").prop('disabled', false); // disabel input.range before load data
            random = Math.floor((Math.random() * 250) + 1); // random number from 1 to 250 (250 = all cuntires)
            var countrieQuest = countrie[random]; // random countrie to the game 178 = Poland index

            var population = countrieQuest.population; // select population of the countrieQuest
            var nameTranslations = countrieQuest.nameTranslations.de + ', ' + countrieQuest.nameTranslations.es + ', ' + countrieQuest.nameTranslations.fr + ', ' + countrieQuest.nameTranslations.ja + ', ' + countrieQuest.nameTranslations.it;

            var countrieData = ('<tr><td>Kod</td><td>' + countrieQuest.code + '</td>' +
                '</td></tr><tr><td>Stolica</td><td>' + countrieQuest.capitol + '</td>' +
                '</td></tr><tr><td>Powierzchnia</td><td>' + countrieQuest.area + 'km<sup>2</sup></td>' +
                '</td></tr><tr><td>Kod telefoniczny</td><td>+' + countrieQuest.phoneCode + '</td>' +
                '</td></tr><tr><td>Region</td><td>' + countrieQuest.region + '</td>' +
                '</td></tr><tr><td>Tłumaczenia</td><td>' + nameTranslations + '</td>' +
                '</td></tr><tr><td>Sąsiedzi</td><td>' + countrieQuest.borders + '</td>' +
                '</td></tr><tr><td>Lokalna nazwa</td><td>' + countrieQuest.nativeName + '</td>' +
                '</td></tr><tr><td>Waluta</td><td>' + countrieQuest.currencies + '</td>' +
                '</td></tr><tr><td>Języki</td><td>' + countrieQuest.languages +
                '</td></tr>'
            );
            // console.log(countrieQuest);

            $('#countryQuest').html(' ' + countrieQuest.name); // insert name of countrie
            minVal = Math.round(population / 1000) * 1000 / 10; // radnom MIN value of population to choose
            maxVal = Math.round(population / 1000) * 1000 * 3; //radnom MAX value of population to choose
            $('#myRange').attr('min', minVal); // add MIN value attribute to input.range
            $('#minPop').html(numeral(minVal).format('0,000.00a')); // display MIN value before input.range
            $('#myRange').attr('max', maxVal); // add MAX value attribute to input.range
            $('#maxPop').html(numeral(maxVal).format('0,000.00a')); // display MAX value before input.range

            $('#countrieQuestion').html(countrieQuest.name);
            $('#countrieData2').html(countrieData);

            console.log('minRange: ' + $('#myRange').attr('min'));
            console.log('maxRange: ' + $('#myRange').attr('max'));


            minRightAnswer = population - (population / 100 * 20); // select MIN value to correct answer
            maxRightAnswer = population + (population / 100 * 20); // select MAX value to right answer
            console.log('correct answer between: ' + minRightAnswer + ' - ' + maxRightAnswer); // display range of correct value


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
                    $('#wrong').hide();
                    $('#correct').hide();
                    $('#correct').fadeIn('slow');
                    $('#countrieData').fadeIn("slow");

                } else {
                    console.log('ŹLE!');
                    $('#correct').hide();
                    $('#countrieData').hide();
                    $('#wrong').hide();
                    $('#wrong').fadeIn('slow');
                }
            });
            /** CHECK CORRECT ANSWER END **/
            /** Google Map 2 **/
            $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKljXf4TroNrn0vwSpdLiC5bZF1htiO9Y&callback=initMap" async defer></script>');
            /** Google Map 2 END **/

            // $('#wrong').hide();
            // $('#correct').hide();
            // $('#countrieData').hide();
        }
    });
};
startQuiz();



/** Video Background **/
var vid = document.getElementById("bgvid");
var pauseButton = document.querySelector("#polina button");

if (window.matchMedia('(prefers-reduced-motion)').matches) {
    vid.removeAttribute("autoplay");
    vid.pause();
    pauseButton.innerHTML = "Paused";
}

function vidFade() {
    vid.classList.add("stopfade");
}

// vid.addEventListener('ended', function()
// {
// // only functional if "loop" is removed
//     vid.pause();
// // to capture IE10
//     vidFade();
// });

// pauseButton.addEventListener("click", function() {
//     vid.classList.toggle("stopfade");
//     if (vid.paused) {
//         vid.play();
//         pauseButton.innerHTML = "Pause";
//     } else {
//         vid.pause();
//         pauseButton.innerHTML = "Paused";
//     }
// })

