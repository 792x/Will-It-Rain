
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });





});

$(document).ready(function() {
    $('#main-content').fadeIn(2000);
});


$(function () {
    var data_url = "http://gps.buienradar.nl/getrr.php?";
    var goodMap = true;
    var today = new Date();
    $('#arrowz').hide();
    $('.spinner').show();
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);

    }
    else {
        showError("Your browser does not support Geolocation!");
        alert("Your browser does not support Geolocation!")


    }





    function locationSuccess(position) {
        $('.spinner').hide();

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // alert("lat: " + lat + "lon: " + lon);
        
        var mapOptions = {

            zoom: 14,
            center: new google.maps.LatLng(lat, lon), 
            disableDefaultUI: true,
            scrollwheel: true,
            draggable: true,

            // Map style
            styles: [{
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 17
                }]
            }, {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 20
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 17
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 29
                }, {
                    "weight": 0.2
                }]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 18
                }]
            }, {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 16
                }]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 21
                }]
            }, {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "color": "#000000"
                }, {
                    "lightness": 16
                }]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "saturation": 36
                }, {
                    "color": "#000000"
                }, {
                    "lightness": 40
                }]
            }, {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 19
                }]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 20
                }]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#000000"
                }, {
                    "lightness": 17
                }, {
                    "weight": 1.2
                }]
            }]
        };


        var mapElement = document.getElementById('map');

        var map = new google.maps.Map(mapElement, mapOptions);


        var image = 'img/map-marker.png';
        var myLatLng = new google.maps.LatLng(lat, lon);
        var beachMarker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: 'img/map-marker.png'
        });







        $('#map').addClass('zoomt');
        var timereading = new Array(15);
        var rainreading = new Array(15);
      
        //Script to use cross domain requests
        jQuery.ajax = (function (_ajax) {

            var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

            function isExternal(url) {
                return !exRegex.test(url) && /:\/\//.test(url);
            }

            return function (o) {

                var url = o.url;

                if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {

                    o.url = YQL;
                    o.dataType = 'json';

                    o.data = {
                        q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                        format: 'xml'
                    };

                    if (!o.success && o.complete) {
                        o.success = o.complete;
                        delete o.complete;
                    }

                    o.success = (function (_success) {
                        return function (data) {

                            if (_success) {
                                _success.call(this, {
                                    responseText: data.results[0]
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                                }, 'success');
                            }

                        };
                    })(o.success);

                }

                return _ajax.apply(this, arguments);

            };

        })(jQuery.ajax);

        //Handling the response

        $.ajax({
            url: "http://gps.buienradar.nl/getrr.php?lat=" + lat + "&lon=" + lon,
            type: 'GET',
            success: function (res) {
                var text = res.responseText;
                var text2 = text.replace(/<(?:.|\n)*?>/gm, '');

                var datareading = text2.split("&#xd;");
                for (i = 1; i < datareading.length; i++) {

                    rainreading[i] = datareading[i].substring(1, 4);

                    timereading[i] = datareading[i].substring(5, 10);
                }
                //window.alert(datareading[5]);

                for (i = 2; i < rainreading.length; i++) {
                    // window.alert(timereading[i] + " " + rainreading[i]);
                    if (parseInt(rainreading[i], 10) >= 5 && parseInt(rainreading[i], 10) <= 30) {
                        if (dateDiff(timereading[i]) > 4) {
                            $('#arrowz').show();
                            $("#weather").html("Very light rain in " + dateDiff(timereading[i]) + " minutes, around " + timereading[i]);
                             // window.alert("used: " + timereading[i] + " " + rainreading[i]);
                            i = rainreading.length;
                        }

                    }
                    else if (parseInt(rainreading[i], 10) > 30 && parseInt(rainreading[i], 10) <= 70) {
                        if (dateDiff(timereading[i]) > 4) {
                            $('#arrowz').show();
                            $("#weather").html("Light rain in " + dateDiff(timereading[i]) + " minutes, around " + timereading[i]);
                           // window.alert("used: " + timereading[i] + " " + rainreading[i]);
                            i = rainreading.length;
                        }
                    }
                    else if (parseInt(rainreading[i], 10) > 70 && parseInt(rainreading[i], 10) <= 120) {
                        if (dateDiff(timereading[i]) > 4) {
                            $('#arrowz').show();
                            $("#weather").html("Average rain in " + dateDiff(timereading[i]) + " minutes, around " + timereading[i]);
                            // window.alert("used: " + timereading[i] + " " + rainreading[i]);
                            i = rainreading.length;
                        }
                    }
                    else if (parseInt(rainreading[i], 10) > 120 && parseInt(rainreading[i], 10) <= 175) {
                        if (dateDiff(timereading[i]) > 4) {
                            $('#arrowz').show();
                            $("#weather").html("Heavy rain in " + dateDiff(timereading[i]) + " minutes, around " + timereading[i]);
                            // window.alert("used: " + timereading[i] + " " + rainreading[i]);
                            i = rainreading.length;
                        }
                    }
                    else if (parseInt(rainreading[i], 10) > 175 && parseInt(rainreading[i], 10) <= 255) {
                        if (dateDiff(timereading[i]) > 4) {
                            $('#arrowz').show();
                            $("#weather").html("Extreme rain in " + dateDiff(timereading[i]) + " minutes, around " + timereading[i]);
                            // window.alert("used: " + timereading[i] + " " + rainreading[i]);
                            i = rainreading.length;
                        }
                    }
                    else {
                        $('#arrowz').show();
                        $("#weather").html("It will not be raining anytime soon!");
                    }

                }
                // alert(text2);
            }
        });








    }


    //Calculate time difference in minutes
    function dateDiff(time2) {
        today = new Date();
        var t2 = new Date();
        parts = time2.split(":");
        t2.setHours(parts[0], parts[1], 0, 0);
        diffMinutes = parseInt(Math.abs(today.getTime() - t2.getTime()) / (1000 * 60));

        return diffMinutes;
    }


    //Error handling
    function locationError(error) {
        switch (error.code) {
            case error.TIMEOUT:
                showError("A timeout occured! Please try again!");

                break;
            case error.POSITION_UNAVAILABLE:
                showError('We can\'t detect your location. Sorry!');

                break;
            case error.PERMISSION_DENIED:
                showError('Please allow geolocation access for this to work.');

                break;
            case error.UNKNOWN_ERROR:
                showError('An unknown error occured!');

                break;
        }

    }
    //Displaying the error
    function showError(msg) {
        $('#arrowz').show();
        $("#weather").html(msg);
        $('.spinner').hide();
    }



});


// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

