// Reference for Geo co-ordinates conversion
// http://en.wikipedia.org/wiki/Geographic_coordinate_conversion
var TSamples = function() {
    var writeAddress = function(coordinates) {
        var latLong = coordinates.lati.toString() + ',' + coordinates.longi.toString();
        var latlng = new google.maps.LatLng(coordinates.lati, coordinates.longi);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(status);
                if (results[1]) {
                    address = results[1].formatted_address;
                    console.log(address);
                    var node = $('div[data-latlong="'+ latLong + '"]');
                    node.append($('<span>').text(address).addClass('address'));
                }
            }
        });
    };

    var initSocker = function() {
        var socket = io.connect(window.location.hostname);
        var coordinates = { lati: 0, longi: 0};
        socket.on('data', function(data) {
            // coordinates.lati  = Math.round(data.coordinates[0]; * 100) / 100;
            // coordinates.longi  = Math.round(data.coordinates[1]; * 100) / 100;
            coordinates.lati  = data.coordinates[0];
            coordinates.longi  = data.coordinates[1];

            var latLong = coordinates.lati.toString() + ',' + coordinates.longi.toString();
            var node = $('div[data-latlong="'+ latLong + '"]');
            var address = '';
            if (node.length > 0) {
                var count = node.find('span.count')
                var tweets = Number(count.text()) + 1;
                count.text(tweets);
            } else {
                node = $('<div>').attr('data-latlong', latLong )
                    .append($('<span>').text(1).addClass('count'))
                    .append($('<span>').text(latLong).addClass('caption'));
                $('div.tweet_location').append(node);
                writeAddress(coordinates);
            }
        });
    };

    return {
        initSocker : initSocker
    }
}();

$(function() {
    geocoder = new google.maps.Geocoder();
    TSamples.initSocker();
});
