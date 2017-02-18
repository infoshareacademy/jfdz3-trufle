$('#tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});
var inputCountryField = document.querySelector('#inputCountry');
var inputCountryObservable = Rx.Observable.fromEvent(inputCountryField, 'keyup')
    .map(function (e) { return e.target.value; })
    .debounce(500)
    .distinctUntilChanged();
var AccessToApi = (function () {
    function AccessToApi() {
    }
    AccessToApi.prototype.get = function (url) {
        return Rx.Observable.create(function (observer) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function () {
                if (req.status == 200) {
                    observer.onNext(req.response);
                    observer.onCompleted();
                }
                else {
                    observer.onError(new Error(req.statusText));
                }
            };
            req.onerror = function () {
                observer.onError(new Error("Unknown Error"));
            };
            req.send();
        });
    };
    return AccessToApi;
}());
var _accessOneCountryDataObservable = new AccessToApi();
inputCountryObservable.subscribe(function (countryInputFilter) {
    if (countryInputFilter === '') {
        var fullPath = 'https://restcountries.eu/rest/v1/all';
    }
    else {
        var fullPath = 'https://restcountries.eu/rest/v1/name/';
    }
    _accessOneCountryDataObservable.get(fullPath + countryInputFilter)
        .map(function (countries) {
        $("span.badge").text(JSON.parse(countries).length);
        return JSON.parse(countries);
    }).forEach(function (countries) {
        $('#mainBody').empty();
        for (var _i = 0, countries_1 = countries; _i < countries_1.length; _i++) {
            var country = countries_1[_i];
            displayCountries(country);
            if (countries.length == 1) {
                findAndDisplayBorderCountries(country);
                showWeather(country);
                displayGoogleMap(country);
            }
        }
    });
});
function findAndDisplayBorderCountries(country) {
    var findBorderCountriesFilter = 'https://restcountries.eu/rest/v1/alpha?codes=';
    country.borders.forEach(function (border) {
        findBorderCountriesFilter = findBorderCountriesFilter + border + ';';
    });
    var _borderCountries = new AccessToApi();
    _borderCountries.get(findBorderCountriesFilter)
        .map(function (borderCountries) {
        return JSON.parse(borderCountries);
    }).forEach(function (borderCountries) {
        $('#borderCountries').empty();
        var allBorderCountries = '';
        for (var _i = 0, borderCountries_1 = borderCountries; _i < borderCountries_1.length; _i++) {
            var country_1 = borderCountries_1[_i];
            allBorderCountries = allBorderCountries + '<li>' + country_1.name + '</li>';
        }
        ;
        $('#borderCountries').append("\n                         <div class=\"panel panel-default\">\n                                <div class=\"panel-heading\"><b>Borders: </b></div>\n                                <div class=\"panel-body\">\n                                       <ul>\n                                          " + allBorderCountries + "\n                                       </ul>\n                                </div>\n                         </div>\n         ");
    });
}
function displayCountries(country) {
    $('#mainBody').append("\n            <div class=\"panel panel-default\">\n                     <div class=\"panel-heading\">\n                        <span><img src='./img/flags/" + country.alpha3Code + ".gif'></span>\n                         " + country.name + "\n                     </div>   \n                <div class=\"panel-body\">\n                        <div class=\"col-md-6\">\n                            <div><b>Capital:</b> " + country.capital + "</div> \n                            <div><b>Population: </b> " + Number(country.population).toLocaleString('pl') + "</div> \n                        </div>\n                        <div class=\"col-md-6\" id=\"borderCountries\">\n                                \n                        </div>\n                </div>\n                <div class=\"panel-footer\">\n                    Further Information on Wiki<span> <a href=\"https://en.wikipedia.org/wiki/" + country.name + "\" target='_blank'>" + country.name + "</a></span>\n                </div>\n            </div>");
}
function showWeather(country) {
    $('#weather').empty();
    var latitude = country.latlng[0];
    var longitude = country.latlng[1];
    var httpAddress = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=06ad02c89abfc0a7fcdff1e5eff12b39&units=metric";
    var _getAccessToWeatherApi = new AccessToApi();
    _getAccessToWeatherApi.get(httpAddress)
        .map(function (data) {
        return JSON.parse(data);
    }).subscribe(function (data) {
        $('#weather').append("\n            <div class=\"row\">\n                <div class=\"col-md-9\">\n                    <p><b>Weather:</b> " + data.weather[0].description + "</p>\n                    <p><b>Temperature:</b> " + data.main.temp + "\u00B0C</p>\n                </div>  \n                <div class=\"col-md-3\">\n                    <!--<img src=\"./img/weather/abw.gif\" alt=\"\"> -->\n                    <img src=\"./img/weather/" + data.weather[0].icon + ".png\" alt=\"\"> \n                </div>\n                </div>");
        $('#weather').css('display', 'block');
    });
}
function displayGoogleMap(country) {
    var uluru = { lat: country.latlng[0], lng: country.latlng[1] };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
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
    var _accessAllCountriesDataObservable = new AccessToApi();
    _accessAllCountriesDataObservable.get('https://restcountries.eu/rest/v1/all')
        .map(function (allCountries) {
        return JSON.parse(allCountries);
    })
        .filter(function (countries) {
        countries.forEach(function (item, index, object) {
            if (item.borders.length == 0) {
                object.splice(index, 1);
            }
        });
        return countries;
    })
        .subscribe(function (filteredCountries) {
        var chkb = [];
        if ($('#europe').is(':checked'))
            chkb.push('Europe');
        if ($('#asia').is(':checked'))
            chkb.push('Asia');
        if ($('#oceania').is(':checked'))
            chkb.push('Oceania');
        if ($('#americas').is(':checked'))
            chkb.push('Americas');
        if ($('#africa').is(':checked'))
            chkb.push('Africa');
        filteredCountriesGlobal = filteredCountries.filter(function (country) {
            return chkb.indexOf(country.region) != -1;
        });
        licznik(30, 1);
        quiz5GenerateQuestions();
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
    var givenTimeMinText = givenTimeMin.toString();
    var givenTimeSecText = givenTimeSec.toString();
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
    var mappingObject = {};
    filteredCountriesGlobal
        .forEach(function (country) {
        mappingObject[country.alpha3Code] = country.name;
    });
    filteredCountriesGlobal.forEach(function (country) {
        var bordersArray = country.borders;
        var fullArrayToInclude = [];
        var fakeArrayToInclude = [];
        bordersArray.forEach(function (countryCode) {
            fullArrayToInclude.push(mappingObject[countryCode]);
            country.bordersFull = fullArrayToInclude;
        });
        for (var i = 1; i <= 3; i++) {
            var randomIndex = Math.floor(Math.random() * filteredCountriesGlobal.length);
            fakeArrayToInclude.push(filteredCountriesGlobal[randomIndex].name);
        }
        country.bordersFake = fakeArrayToInclude;
    });
    quiz5Display();
}
function quiz5Display() {
    randomqGlobal = Math.floor(Math.random() * filteredCountriesGlobal.length);
    filteredCountriesGlobal[randomqGlobal].bordersFake.push(filteredCountriesGlobal[randomqGlobal].bordersFull[0]);
    var fakeAnswersTableSortedTmp = filteredCountriesGlobal[randomqGlobal].bordersFake.sort();
    var fakeAnswersTableSorted = fakeAnswersTableSortedTmp.reduce(function (a, b) {
        if (a.indexOf(b) < 0)
            a.push(b);
        return a;
    }, []);
    if (numberOfQuestions <= 5) {
        $('.quiz-panel').append("\n        <h3 class=\"sl-question-header\"> Z jakim krajem graniczy  " + filteredCountriesGlobal[randomqGlobal].name + " ? </h3>\n        \n    ");
        for (var i = 0; i <= fakeAnswersTableSorted.length - 1; i++) {
            $('.quiz-panel').append("\n                <div class=\"radio\">\n                     <label><input type=\"radio\" name=\"optradio\" value=\"" + fakeAnswersTableSorted[i] + "\">" + fakeAnswersTableSorted[i] + "</label>\n                </div>\n                ");
        }
        $('#start-test').prop('disabled', true);
        $('#europe, #asia, #africa, #americas, #oceania').addClass('disabled');
        $('.myFlag').addClass('disabled');
    }
}
function nextQuestion() {
    numberOfQuestions = numberOfQuestions + 1;
    if (numberOfQuestions <= 5) {
        var chosenAnswer = $("input[type=radio][name=optradio]:checked").val();
        var checkedAnswer = filteredCountriesGlobal[randomqGlobal].bordersFull.indexOf(chosenAnswer);
        $('.quiz-panel').empty();
        if (checkedAnswer == -1) {
            $('.quiz-odpowiedzi').append("\n                <div class=\"alert alert-danger alert-dismissable\">\n                    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>\n                   <strong>B\u0142\u0119dna odpowied\u017A.</strong>  " + filteredCountriesGlobal[randomqGlobal].name + " graniczy z " + filteredCountriesGlobal[randomqGlobal].bordersFull[0] + "</div>\n                </div>\n        ");
        }
        else {
            $('.quiz-odpowiedzi').append("<div class=\"alert alert-success alert-dismissable\">\n                    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>\n                   <strong>Poprawna odpowied\u017A.</strong>  " + filteredCountriesGlobal[randomqGlobal].name + " graniczy z " + filteredCountriesGlobal[randomqGlobal].bordersFull[0] + "</div>\n            </div>\n            ");
        }
        quiz5Display();
    }
    else {
        lastAnswer();
    }
}
function lastAnswer() {
    var chosenAnswer = $("input[type=radio][name=optradio]:checked").val();
    var checkedAnswer = filteredCountriesGlobal[randomqGlobal].bordersFull.indexOf(chosenAnswer);
    $('.quiz-panel').empty();
    if (checkedAnswer == -1) {
        $('.quiz-odpowiedzi').append("\n                <div class=\"alert alert-danger alert-dismissable\">\n                    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>\n                   <strong>B\u0142\u0119dna odpowied\u017A.</strong>  " + filteredCountriesGlobal[randomqGlobal].name + " graniczy z " + filteredCountriesGlobal[randomqGlobal].bordersFull[0] + "</div>\n                </div>\n        ");
    }
    else {
        $('.quiz-odpowiedzi').append("<div class=\"alert alert-success alert-dismissable\">\n                    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>\n                   <strong>Poprawna odpowied\u017A.</strong>  " + filteredCountriesGlobal[randomqGlobal].name + " graniczy z " + filteredCountriesGlobal[randomqGlobal].bordersFull[0] + "</div>\n            </div>\n");
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
