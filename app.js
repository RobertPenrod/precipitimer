const rainBackgroundURL = 'https://64.media.tumblr.com/834d72ef32d84b400266a4aa6661ff31/tumblr_n26039VliX1r3nnfeo1_500.gif';
const snowBackgroundURL = 'https://bestanimations.com/media/snow/795778201winter-snow-nature-animated-gif-27.gif';

$('.content').hide();

getCoordinates((coords) => {
    getCityFromCoordinates(coords, (city) => {
        getForcast(city, (weatherJSON) => {

            pareseForecast(weatherJSON);

            splitAddress = weatherJSON.resolvedAddress.split(',');
            $('#location').text(splitAddress[0] + ',' + splitAddress[1]);
            
            $('.loader').fadeOut(500);
            setTimeout(() => {
                $('.content').fadeIn(500);
            }, 500);

        });
    });
});

function getCoordinates(successCallback, errorCallback) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
    function geoFailure(err) {
        errorCallback(err)
    }
    function geoSuccess(position) {
        var crd = position.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        successCallback(coordinates);
    }
}

function getCityFromCoordinates(coordinates, callback) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.aa4366061febd32a707b637dff43285d&lat=" +
    lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            userCity = city;
            callback(city);
        }
    }
}

function getForcast(city, callback) {
    var cityFetchString = city.replace(/\s/g, '%20');
    var uri = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + cityFetchString + "?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Chumidity%2Cprecip%2Cprecipprob%2Cprecipcover%2Cpreciptype%2Csnow&include=days%2Chours&key=4YV6K4LLS848X7LUV7XHP43F4&contentType=json";
    $.get(uri).done(function(rawResponse) {
        callback(rawResponse);
    })
    .fail(function() {
        console.log("jQuery Request failed");
    });
}

function pareseForecast(forecast) {

    console.log(forecast);
    var currentDate = new Date();

    var days = forecast.days;
    for(var d=0; d < days.length; d++) {
        var hours = days[d].hours;
        for(var h=0; h < hours.length; h++) {

            var hour = days[d].hours[h];
            var precipType = hour.preciptype;

            if(precipType !== null) {
                var precipDateTime = new Date();
                precipDateTime.setTime(hour.datetimeEpoch * 1000);

                if(precipDateTime <= currentDate) {
                    var msInHour = 3600000
                    if(currentDate - precipDateTime <= msInHour) {
                        //$('#percip-type').text('It is currently ' + precipType + 'ing');
                        //return;
                    }
                }
                else {
                    precipString = precipType[0];
                    $('#percip-type').text(precipString.toUpperCase());
                    setBackground(precipString);
                    setFlipTimer(precipDateTime);
                    return;
                }
            }
        }
    }
}

function setBackground(precipType) {
    var imageURL;
    switch(precipType) {
        default:
        case 'rain':
            imageURL = rainBackgroundURL;
            break;
        case 'snow':
            imageURL = snowBackgroundURL;
            break;
    }

    $('.bg-image').fadeOut(250);
    setTimeout(() => {
        $('.bg-image').css('background-image', 'url(' + imageURL + ')');
        $('.bg-image').fadeIn(250);
    }, 250)
}