
$('#tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

const inputCountryField = document.querySelector('#inputCountry');
const inputCountryObservable = Rx.Observable.fromEvent(inputCountryField, 'keyup')
    .map((e: any) => e.target.value)
    .debounce(500)
    .distinctUntilChanged();

class AccessToApi {
    get(url) {
        return Rx.Observable.create(function (observer) {
                var req = new XMLHttpRequest();
                req.open('GET', url);
                req.onload = function () {
                    if (req.status == 200) {
                        observer.onNext(req.response);
                        observer.onCompleted();
                    } else {
                        observer.onError(new Error(req.statusText));
                    }
                };
                req.onerror = function () {
                    observer.onError(new Error("Unknown Error"));
                };
                req.send();
            }
        );
    }
}


let _accessOneCountryDataObservable = new AccessToApi();

inputCountryObservable.subscribe((countryInputFilter) => {
    if (countryInputFilter === '') {
        var fullPath = 'https://restcountries.eu/rest/v1/all';
    } else {
        var fullPath = 'https://restcountries.eu/rest/v1/name/';
    }
    _accessOneCountryDataObservable.get(fullPath + countryInputFilter)
        .map((countries) => {
            $("span.badge").text(JSON.parse(countries).length);
            return JSON.parse(countries);
        }).forEach((countries) => {

        $('#mainBody').empty();

        for (let country of countries) {
            displayCountries(country);
            if (countries.length == 1) {
                findAndDisplayBorderCountries(country);
                showWeather(country);
                displayGoogleMap(country);
            }
        }
    })
});

function findAndDisplayBorderCountries(country) {

    let findBorderCountriesFilter = 'https://restcountries.eu/rest/v1/alpha?codes=';

    country.borders.forEach((border) => {
        findBorderCountriesFilter = findBorderCountriesFilter + border + ';';
    });

    let _borderCountries = new AccessToApi();
    _borderCountries.get(findBorderCountriesFilter)
        .map((borderCountries) => {
            return JSON.parse(borderCountries);
        }).forEach((borderCountries) => {
        $('#borderCountries').empty();
        var allBorderCountries = '';
        for (let country of borderCountries) {
            allBorderCountries = allBorderCountries + '<li>' + country.name + '</li>'
        };
        $('#borderCountries').append(`
                         <div class="panel panel-default">
                                <div class="panel-heading"><b>Borders: </b></div>
                                <div class="panel-body">
                                       <ul>
                                          ${allBorderCountries}
                                       </ul>
                                </div>
                         </div>
         `);
    })
}

function displayCountries(country) {
    $('#mainBody').append(`
            <div class="panel panel-default">
                     <div class="panel-heading">
                        <span><img src='./img/flags/${country.alpha3Code}.gif'></span>
                         ${country.name}
                     </div>   
                <div class="panel-body">
                        <div class="col-md-6">
                            <div><b>Capital:</b> ${country.capital}</div> 
                            <div><b>Population: </b> ${Number(country.population).toLocaleString('pl')}</div> 
                        </div>
                        <div class="col-md-6" id="borderCountries">
                                
                        </div>
                </div>
                <div class="panel-footer">
                    Further Information on Wiki<span> <a href="https://en.wikipedia.org/wiki/${country.name}" target='_blank'>${country.name}</a></span>
                </div>
            </div>`);
}

function showWeather(country) {
    $('#weather').empty();

    const latitude = country.latlng[0];
    const longitude = country.latlng[1];
    const httpAddress = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=06ad02c89abfc0a7fcdff1e5eff12b39&units=metric`;
    const _getAccessToWeatherApi = new AccessToApi();

    _getAccessToWeatherApi.get(httpAddress)
        .map((data) => {
            return JSON.parse(data);
        }).subscribe((data) => {
        $('#weather').append(`
            <div class="row">
                <div class="col-md-9">
                    <p><b>Weather:</b> ${data.weather[0].description}</p>
                    <p><b>Temperature:</b> ${data.main.temp}°C</p>
                </div>  
                <div class="col-md-3">
                    <!--<img src="./img/weather/abw.gif" alt=""> -->
                    <img src="./img/weather/${data.weather[0].icon}.png" alt=""> 
                </div>
                </div>`);
        $('#weather').css('display', 'block');
    })
}


function displayGoogleMap(country) {
    let uluru = {lat: country.latlng[0], lng: country.latlng[1]};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    let marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    $('#map').css('display', 'block');
}


//***********************************
//*********   Quiz            *******
//***********************************

var filteredCountriesGlobal = [];
var randomqGlobal;
var numberOfQuestions = 1;


function quizInitiation() {

    const _accessAllCountriesDataObservable = new AccessToApi();
    _accessAllCountriesDataObservable.get('https://restcountries.eu/rest/v1/all')
        .map((allCountries) => {
            return JSON.parse(allCountries);
        })
        .filter((countries) => {
            countries.forEach(function (item, index, object) {
                if (item.borders.length == 0) {
                    object.splice(index, 1);
                }
            });
            return countries
        })
        .subscribe((filteredCountries) => {
            var chkb = [];
            if ($('#europe').is(':checked')) chkb.push('Europe');
            if ($('#asia').is(':checked')) chkb.push('Asia');
            if ($('#oceania').is(':checked')) chkb.push('Oceania');
            if ($('#americas').is(':checked')) chkb.push('Americas');
            if ($('#africa').is(':checked')) chkb.push('Africa');

            filteredCountriesGlobal = filteredCountries.filter((country) => {
                return chkb.indexOf(country.region) != -1
            });
            licznik(30, 1);
            quiz5GenerateQuestions()
        });
}

function licznik(givenTimeSec, givenTimeMin) {
    $('#timerHeader').css('display', 'block');
    givenTimeSec--;

    if (givenTimeMin == 0 && givenTimeSec < 0) {
        console.log("czas wygasl");
        return;
    }

    if (givenTimeSec == -1) {
        if (givenTimeMin > 0) {
            givenTimeMin--;
            givenTimeSec = 59;
        }
    }

    let givenTimeMinText = givenTimeMin.toString();
    let givenTimeSecText = givenTimeSec.toString();

    if (givenTimeMin < 10) {
        givenTimeMinText = '0' + givenTimeMinText;
    }
    if (givenTimeSec < 10) {
        givenTimeSecText = '0' + givenTimeSec;
    }

    document.getElementById("timer").innerHTML = ' Time: ' + givenTimeMinText + ' : ' + givenTimeSecText;
    setTimeout(function () {
        licznik(givenTimeSec, givenTimeMin);
    }, 1000);
}


function quiz5GenerateQuestions() {
    const mappingObject = {};
    filteredCountriesGlobal
        .forEach((country) => {
            mappingObject[country.alpha3Code] = country.name;
        });

    filteredCountriesGlobal.forEach((country) => {

        const bordersArray = country.borders;
        const fullArrayToInclude = [];
        const fakeArrayToInclude = [];

        bordersArray.forEach((countryCode) => {
            fullArrayToInclude.push(mappingObject[countryCode]);
            country.bordersFull = fullArrayToInclude;
        });

        for (let i = 1; i <= 3; i++) {
            let randomIndex = Math.floor(Math.random() * filteredCountriesGlobal.length);
            fakeArrayToInclude.push(filteredCountriesGlobal[randomIndex].name);
        }


        country.bordersFake = fakeArrayToInclude;
    });

    quiz5Display();
}


function quiz5Display() {


    randomqGlobal = Math.floor(Math.random() * filteredCountriesGlobal.length);
    filteredCountriesGlobal[randomqGlobal].bordersFake.push(filteredCountriesGlobal[randomqGlobal].bordersFull[0]);
    let fakeAnswersTableSortedTmp = filteredCountriesGlobal[randomqGlobal].bordersFake.sort();
    let fakeAnswersTableSorted = fakeAnswersTableSortedTmp.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);

    if (numberOfQuestions <= 5) {
        $('.quiz-panel').append(`
        <h3 class="sl-question-header"> Z jakim krajem graniczy  ${filteredCountriesGlobal[randomqGlobal].name} ? </h3>
        
    `);
        for (let i = 0; i <= fakeAnswersTableSorted.length - 1; i++) {
            $('.quiz-panel').append(`
                <div class="radio">
                     <label><input type="radio" name="optradio" value="${fakeAnswersTableSorted[i]}">${fakeAnswersTableSorted[i]}</label>
                </div>
                `);
        }

        $('#start-test').prop('disabled', true);
        $('#europe, #asia, #africa, #americas, #oceania').addClass('disabled');
        $('.myFlag').addClass('disabled');
    }
}


function nextQuestion() {
    numberOfQuestions = numberOfQuestions + 1;
    if (numberOfQuestions <= 5) {
        let chosenAnswer = $("input[type=radio][name=optradio]:checked").val();
        let checkedAnswer = filteredCountriesGlobal[randomqGlobal].bordersFull.indexOf(chosenAnswer);
        $('.quiz-panel').empty();

        if (checkedAnswer == -1) {
            $('.quiz-odpowiedzi').append(`
                <div class="alert alert-danger alert-dismissable">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                   <strong>Błędna odpowiedź.</strong>  ${filteredCountriesGlobal[randomqGlobal].name} graniczy z ${filteredCountriesGlobal[randomqGlobal].bordersFull[0]}</div>
                </div>
        `)

        } else {
            $('.quiz-odpowiedzi').append(
                `<div class="alert alert-success alert-dismissable">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                   <strong>Poprawna odpowiedź.</strong>  ${filteredCountriesGlobal[randomqGlobal].name} graniczy z ${filteredCountriesGlobal[randomqGlobal].bordersFull[0]}</div>
            </div>
            `)
        }
        quiz5Display();
    } else {
        lastAnswer();
    }
}

function lastAnswer() {
    let chosenAnswer = $("input[type=radio][name=optradio]:checked").val();
    let checkedAnswer = filteredCountriesGlobal[randomqGlobal].bordersFull.indexOf(chosenAnswer);
    $('.quiz-panel').empty();
    if (checkedAnswer == -1) {
        $('.quiz-odpowiedzi').append(`
                <div class="alert alert-danger alert-dismissable">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                   <strong>Błędna odpowiedź.</strong>  ${filteredCountriesGlobal[randomqGlobal].name} graniczy z ${filteredCountriesGlobal[randomqGlobal].bordersFull[0]}</div>
                </div>
        `);
    } else {
        $('.quiz-odpowiedzi').append(
            `<div class="alert alert-success alert-dismissable">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                   <strong>Poprawna odpowiedź.</strong>  ${filteredCountriesGlobal[randomqGlobal].name} graniczy z ${filteredCountriesGlobal[randomqGlobal].bordersFull[0]}</div>
            </div>
`);
    }
    $('#next-question').prop('disabled', true);
    theEnd();
}

function theEnd() {
    $('#new-quiz').prop('disabled', false);
}

function newQuiz() {
    location.reload(true);
}