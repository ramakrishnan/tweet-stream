var TSamples = function() {
    var writeAddress = function(coordinates) {
        var latLong = coordinates[0].toString() + ',' + coordinates[1].toString();
        var latlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    address = results[1].formatted_address;
                    var node = $('div[data-latlong="'+ latLong + '"]');
                    node.append($('<span>').text(address).addClass('address'));
                }
            }
        });
    };

    var initSocker = function() {
        var socket = io.connect(window.location.hostname);
        socket.on('data', function(data) {
            var latLong = data.coordinates[0].toString() + ',' + data.coordinates[1].toString();
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
                writeAddress(data.coordinates);
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
