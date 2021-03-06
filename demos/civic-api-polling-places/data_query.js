    var map;
    var marker;
    var coordinate;
    var inputtedAddress;
    var pollingAddress;
    var geocoder = new google.maps.Geocoder();
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    /*
    Build and execute request to look up voter info for provided address.
    @param {string} address Address for which to fetch voter info.
    @param {function(Object)} callback Function which takes the
    response object as a parameter.
    */

    function lookup(address, callback) {

        // Election ID for which to fetch voter info.
        // @type {number}
        // 4000 is the ID for Nov. 6, 2012 election but doesn't return data
        var electionId = 2000;

        // makes request to api for an object matching given parameters.
        var req = gapi.client.request({

            // query string.
            'path' : '/civicinfo/us_v1/voterinfo/' + electionId + '/lookup',

            // Required. The API does not allow GET requests.
            'method' : 'POST',
            'body' : {'address' : address}
        });

        req.execute(callback);
    }

    // Render results in the DOM.
    // @param {Object} response Response object returned by the API.
    // @param {Object} rawResponse Raw response from the API.

    function renderResults(response, rawResponse) {
        var raceResults = document.getElementById('racesList');

        if (!response || response.error) {
            pollingResults.appendChild(document.createTextNode(
                'Enter your Address above to find your polling location'));
            return;
        }

            var normalizedAddress = response.normalizedInput.line1 + ', ' +
                response.normalizedInput.city + ', ' +
                response.normalizedInput.state + ' ' +
                response.normalizedInput.zip;

                if (response.pollingLocations.length > 0) {
                    var pollingLocation = response.pollingLocations[0].address;
                    pollingAddress = pollingLocation.locationName + ', ' +
                        pollingLocation.line1 + ' ' +
                        pollingLocation.city + ', ' +
                        pollingLocation.state + ' ' +
                        pollingLocation.zip;

                    $('#results').html('Residents of ' + normalizedAddress + ' will vote at ' + pollingAddress);

/*
                    var marker = new google.maps.Marker({
                        map: map,
                        position: pollingAddress
                    });
*/

                } else {
                    pollingResults.appendChild(document.createTextNode(
                        'Could not find polling place for ' + normalizedAddress));
                }


                if (response.contests.length > 0) {
                        for(var i=0; i<response.contests.length; i++){
                            var bulletList = document.createElement('li');
                            bulletList.appendChild(document.createTextNode(
                                response.contests[i].office));
                            raceResults.appendChild(bulletList);
                        }
                } else {
                    console.log('nothing here');
                }
    };

    // keyboard submit
    function enterSubmit() {
        if(event.keyCode==13) {
            zoomtoaddress();
        }
    };

    // geocode address input
    function codeAddress() {
        inputtedAddress = document.getElementById("addressInput").value;
        geocoder.geocode( { 'address': inputtedAddress}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                coordinate = results[0].geometry.location;
                //map.setCenter(coordinate);
                //map.setZoom(17);

/*
                var marker = new google.maps.Marker({
                    map: map,
                    position: coordinate
                });
*/

                // run API function to search addres and render data
                lookup(inputtedAddress, renderResults);

                setTimeout(function() {
                    calculateRoute();
                }, 2000);

            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    // write the map
    function createMap() {

        map = new google.maps.Map(document.getElementById('map_canvas'), {
            center: new google.maps.LatLng(38.134557,-98.349609),
            zoom: 4,
            scrollwheel: false,
            draggable: true,
            mapTypeControl: false,
            navigationControl: true,
            streetViewControl: false,
            panControl: false,
            scaleControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP}
        });
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directions_display'));
    };

    // calculate driving directions to the closest garage
    function calculateRoute(){

/*
        if (infowindow) {
            infowindow.close();
        }
*/

        var start = coordinate;
        var end = pollingAddress;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    };

    // Initialize the API client and make a request.
    function load() {
        gapi.client.setApiKey('AIzaSyBJj_v-VYk6V7vzOIlIj88DiteiuMfpdN4');
        createMap();
    };