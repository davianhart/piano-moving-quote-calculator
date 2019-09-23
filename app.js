function initMap() {
        var bounds = new google.maps.LatLngBounds;
        var markersArray = [];
        
        var basePrice;
        var pianoType = document.getElementById('piano-type').value;
          
        if (pianoType === 'upright-under-43') {
            basePrice = 275;
            console.log(basePrice);
        } else if (pianoType === 'upright-over-43') {
            basePrice = 325;
            console.log(basePrice);
        } else if (pianoType === 'grand-6-6') {
            basePrice = 450;
            console.log(basePrice);
        } else if (pianoType === 'grand-over-6-6') {
            basePrice = 650;
            console.log(basePrice);
        };
        
          
        var origin1 = 'Waterloo, Ontario, Canada'
        var origin2 = document.getElementById('origin-field').value;
        var destinationA = origin2
        var destinationB = document.getElementById('destination-field').value;
        var steps = document.getElementById('steps').value;

        var destinationIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=B|FF0000|000000';
        var originIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=C|FFFF00|00000';
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 55.53, lng: 9.4},
          zoom: 10
        });
        var geocoder = new google.maps.Geocoder;

        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
          origins: [origin1, origin2],
          destinations: [destinationA, destinationB],
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, 
    
    function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            var outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            deleteMarkers(markersArray);

            var showGeocodedAddressOnMap = function(asDestination) {
              var icon = asDestination ? destinationIcon : originIcon;
              return function(results, status) {
                if (status === 'OK') {
                  map.fitBounds(bounds.extend(results[0].geometry.location));
                  markersArray.push(new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: icon
                  }));
                } else {
                  alert('Geocode was not successful due to: ' + status);
                }
              };
            };
              
            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
              geocoder.geocode({'address': originList[i]},
                  showGeocodedAddressOnMap(false));
              for (var j = 0; j < results.length; j++) {
                geocoder.geocode({'address': destinationList[j]},
                    showGeocodedAddressOnMap(true));
                outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                    ': ' + results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br>';
                
              }
            }   
                // Determine if pickup location is close enough to Waterloo to constitute free mileage TO pickup - 30km
                var distanceFromWaterloo = (response.rows[0].elements[0].distance.value);
              
                // Determine billable mileage costs; if pickup is within 30km of Waterloo and 10km from pickup, no mileage
                var distanceFromPickup = (response.rows[1].elements[1].distance.value);
              
                console.log(distanceFromWaterloo);
                console.log(distanceFromPickup);
                var quoteText = document.getElementById('quote');
              
                if (distanceFromWaterloo < 30000 && distanceFromPickup < 10000 && steps <= 3) {
                    var quotePrice = basePrice;
                    quoteText.textContent = `This move will most likely cost $${quotePrice}.`;
                    console.log('distanceFromWaterloo < 30 && distanceFromPickup < 10 && steps < 3');
                    
                } else if (distanceFromWaterloo < 30000 && distanceFromPickup < 10000 && steps > 3) {
                    var quotePrice = (basePrice + ((steps-3) * 10));
                    quoteText = `This move will most likely cost $${quotePrice.toFixed(2)}.`;
                    console.log('distanceFromWaterloo < 30 && distanceFromPickup < 10 && steps > 3');
                    
                } else if (distanceFromWaterloo < 30000 && distanceFromPickup > 10000 && steps <= 3) {
                    var quotePrice = (basePrice + ((distanceFromPickup * 2) * 0.00175));
                    quoteText.textContent = `This move will most likely cost $${quotePrice.toFixed(2)}.`;
                    console.log('distanceFromWaterloo < 30 && distanceFromPickup > 10 && steps < 3');
                    
                } else if (distanceFromWaterloo < 30000 && distanceFromPickup > 10000 && steps > 3) {
                    var quotePrice = (basePrice + (((distanceFromPickup) * 2) * 0.00175) + ((steps-3) * 10));
                    quoteText.textContent = `This move will most likely cost $${quotePrice.toFixed(2)}.`;
                    console.log('distanceFromWaterloo < 30 && distanceFromPickup > 10 && steps > 3');
                    
                } else if (distanceFromWaterloo > 30000 && distanceFromPickup < 10000 && steps <= 3) {
                    var quotePrice = basePrice + ((((distanceFromWaterloo + distanceFromPickup) * 2) * 0.00175));
		            quoteText.textContent = `This move will most likely cost $${quotePrice.toFixed(2)}.`;
                    console.log('distanceFromWaterloo > 30 && distanceFromPickup > 10 && steps < 3');
                    
                } else if (distanceFromWaterloo > 30000 && distanceFromPickup > 10000 && steps <= 3) {
                    var quotePrice = (basePrice + ((((distanceFromWaterloo + distanceFromPickup) * 2) * 0.00175)))
                    quoteText.textContent = `This move will most likely cost $${quotePrice.toFixed(2)}.`
                    console.log((distanceFromWaterloo > 30000 && distanceFromPickup > 10000 && steps < 3))
                    
                } else if (distanceFromWaterloo > 30000 && distanceFromPickup > 10000 && steps > 3) {
                    var quotePrice = (basePrice + ((((distanceFromWaterloo + distanceFromPickup) * 2) * 0.00175) + ((steps-3) * 10)))
                    quoteText.textContent = `This move will most likely cost $${quotePrice.toFixed(2)}.`;
                    console.log(('distanceFromWaterloo > 30000 && distanceFromPickup > 10000 && steps > 3'))
              
                } else if (distanceFromWaterloo > 30000 && steps > 3) {
                    var quotePrice = (basePrice + (((distanceFromWaterloo + distanceFromPickup) * 2) * 0.00175) + ((steps-3) * 10))
		            quoteText.textContent = `This move will most likely cost $${quotePrice.toFixed(2)}.`;
                    console.log('distanceFromWaterloo > 30 && steps > 3');
		        
                } else {
                    quoteText.textContent = `Sorry, there's been a technical error. Please try again.`;
                }
                
          }
        });
      }
    
      function deleteMarkers(markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(null);
        }
        markersArray = [];
      }

    document.getElementById('init-map').addEventListener('click', initMap);
    document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) { initMap(); }
        });
    

