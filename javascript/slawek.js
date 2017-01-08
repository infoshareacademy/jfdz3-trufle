// const fullData;
getData();
function getData() {
    httpGet('https://restcountries.eu/rest/v1/all')
        .then(function (value) {
        generateQuestion(JSON.parse(value));
    }, function (reason) {
        console.error('Brak Polaczenia z baza', reason);
    });
}
;
function httpGet(url) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onload = function () {
            if (this.status === 200) {
                resolve(this.response);
            }
            else {
                // Something went wrong (404 etc.)
                reject(new Error(this.statusText));
            }
        };
        request.onerror = function () {
            reject(new Error('XMLHttpRequest Error: ' + this.statusText));
        };
        request.open('GET', url);
        request.send();
    });
}
function generateQuestion(fullData) {
    var generatedNumber = Math.floor(Math.random() * fullData.length);
    console.log(fullData[generatedNumber]);
}
