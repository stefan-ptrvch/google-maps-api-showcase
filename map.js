// Initial map position
const latLng = {lat: -25.363, lng: 131.044}

// Global map variable
var map
var polygon

// Set default colorscheme for polygon
var strokeColor = "#2ab7ca"
var fillColor = "#fed766"

// Function that initializes Google map
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: latLng
  })

  // MVC array that keeps track of polygon points
  points = new google.maps.MVCArray()
  polygon = new google.maps.Polygon({
    path: points,
    strokeColor: strokeColor,
    fillColor: fillColor
  })
  polygon.setMap(map)

  // Get the modals
  var centerModal = document.getElementById('centerModal')
  var antipodeModal = document.getElementById('antipodeModal')
  var areaModal = document.getElementById('areaModal')

  // Get the buttons
  var centerModalBtn = document.getElementById("centerModalBtn")
  var antipodeModalBtn = document.getElementById("antipodeModalBtn")
  var areaModalBtn = document.getElementById("areaModalBtn")

  // When the user clicks on the button, open the modal
  centerModalBtn.onclick = function() {
    centerModal.style.display = "block";
  }

  antipodeModalBtn.onclick = function() {
    antipodeModal.style.display = "block";
  }

  areaModalBtn.onclick = function() {
    areaModal.style.display = "block";
  }

  // When the user sets the value, close the modal
  setCenter.onclick = function() {
    centerModal.style.display = "none";

    var latLng = {
      lat: parseFloat(document.getElementById("centerLat").value),
      lng: parseFloat(document.getElementById("centerLng").value)
    }
    map.setCenter(latLng)
  }

  setAntipode.onclick = function() {
    antipodeModal.style.display = "none";
    addAntipodeMarker()
  }

  setArea.onclick = function() {
    areaModal.style.display = "none";
    addAreaMarker()

    // Disable modal popup
    areaModalBtn.onclick = addAreaMarker
  }
}

// Functions which help calculate distances between two geolocations
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadiusKm * c;
}


// Part which adds random markers to map
var previousMarker = latLng

// Max and min values for geolocation
const latMax = 90
const latMin = -90
const lngMax = 180
const lngMin = -180

function addRandomMarker() {
  // Calculate random lat and lng, and make sure they're at least 50km away
  // from the previous one
  do {
    var randomLat = Math.random()*(latMax - latMin) + latMin
    var randomLng = Math.random()*(lngMax - lngMin) + lngMin

  } while(distanceInKmBetweenEarthCoordinates(
    randomLat,
    randomLng,
    previousMarker.lat,
    previousMarker.lng
  ) < 50)

  // Remember new marker, for future comparisons
  var newMarker = {lat: randomLat, lng:randomLng}
  previousMarker = newMarker

  // Add marker to map
  var marker = new google.maps.Marker({
    position: newMarker,
    map: map
  })

  // Move map to marker
  map.setCenter(newMarker)
}

// Function that handles markers with antipode functionality
function addAntipodeMarker() {

  // Get lat and lng from user
  var latLng = {
    lat: parseFloat(document.getElementById("antiLat").value),
    lng: parseFloat(document.getElementById("antiLng").value)
  }

  // Check whether data is correct

  // Add marker to map
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  })

  // Add event listener to marker
  marker.addListener('click', function() {

    // Calculate antipode of marker
    var newLat = 0 - latLng.lat
    var newLng = 0 - (180 - Math.abs(latLng.lng))
    var antipode = {lat: newLat, lng: newLng}
    map.setCenter(antipode)

    // Add antipode marker to map
    var marker = new google.maps.Marker({
      position: antipode,
      map: map
    })
  })

  // Set screen to new marker
  map.setCenter(latLng)
}

// Keeps track of center of area
var areaCenter

// Variable which tracks if the addArea button is being pressed for the second
// time
var areaButtonPress = false

// Function which adds marker which represents user specified area
function addAreaMarker() {

  // Check whether it's the first button press
  if (!areaButtonPress) {

    // Get lat and lng from user
    var latLng = {
      lat: parseFloat(document.getElementById("areaLat").value),
      lng: parseFloat(document.getElementById("areaLng").value)
    }

    // Check whether data is valid

    // Calculate lat long of green markers
    var latLngGreen0 = {
      lat: latLng.lat - 0.5,
      lng: latLng.lng - 0.5
    }

    var latLngGreen1 = {
      lat: latLng.lat - 0.5,
      lng: latLng.lng + 0.5
    }

    var latLngGreen2 = {
      lat: latLng.lat + 0.5,
      lng: latLng.lng - 0.5
    }

    var latLngGreen3 = {
      lat: latLng.lat + 0.5,
      lng: latLng.lng + 0.5
    }

    // Remember center marker for further use
    areaCenter =  latLng

    // Add markers to map
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    })

    const iconSize = 45

    var greenMarker0 = new google.maps.Marker({
      position: latLngGreen0,
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new google.maps.Size(iconSize, iconSize)
      }
    })

    var greenMarker1 = new google.maps.Marker({
      position: latLngGreen1,
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new google.maps.Size(iconSize, iconSize)
      }
    })

    var greenMarker2 = new google.maps.Marker({
      position: latLngGreen2,
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new google.maps.Size(iconSize, iconSize)
      }
    })

    var greenMarker3 = new google.maps.Marker({
      position: latLngGreen3,
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new google.maps.Size(iconSize, iconSize)
      }
    })

    // Add info windows to markers
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

    // Info windows
    var infowindow0 = new google.maps.InfoWindow({
      content: contentString
    })

    var infowindow1 = new google.maps.InfoWindow({
      content: contentString
    })

    var infowindow2 = new google.maps.InfoWindow({
      content: contentString
    })

    var infowindow3 = new google.maps.InfoWindow({
      content: contentString
    })

    // Add event listeners for toggling info windows
    var infW0State = false
    greenMarker0.addListener('click', function() {
      infowindow0.open(map, greenMarker0)
      if (infW0State) {
        infowindow0.close(map, greenMarker0)
        infW0State = false
      }
      else {
        infowindow0.open(map, greenMarker0)
        infW0State = true
      }
    })

    var infW1State = false
    greenMarker1.addListener('click', function() {
      infowindow1.open(map, greenMarker1)
      if (infW1State) {
        infowindow1.close(map, greenMarker1)
        infW1State = false
      }
      else {
        infowindow1.open(map, greenMarker1)
        infW1State = true
      }
    })

    var infW2State = false
    greenMarker2.addListener('click', function() {
      infowindow2.open(map, greenMarker2)
      if (infW2State) {
        infowindow2.close(map, greenMarker2)
        infW2State = false
      }
      else {
        infowindow2.open(map, greenMarker2)
        infW2State = true
      }
    })

    var infW3State = false
    greenMarker3.addListener('click', function() {
      infowindow3.open(map, greenMarker3)
      if (infW3State) {
        infowindow3.close(map, greenMarker3)
        infW3State = false
      }
      else {
        infowindow3.open(map, greenMarker3)
        infW3State = true
      }
    })

    areaButtonPress = true

    // Move screen to new markers
    map.setCenter(latLng)
  }

  // Else, add random markers within the specified area
  else {
    var latMax = areaCenter.lat + 0.5
    var latMin = areaCenter.lat - 0.5

    var lngMax = areaCenter.lng + 0.5
    var lngMin = areaCenter.lng - 0.5

    var randomLat = Math.random()*(latMax - latMin) + latMin
    var randomLng = Math.random()*(lngMax - lngMin) + lngMin

    // Add marker
    var marker = new google.maps.Marker({
      position: {lat: randomLat, lng: randomLng},
      map: map
    })
  }
}


// Helper function, which gets called every areaModalBtn press
function addRandomMaybe() {
  if(areaButtonPress) {
    addAreaMarker()
  }
}


// Tracks if polygon mode is enabled or not
var polygonEnabled = false

// Function that takes care of polygon mode
function togglePolygonMode() {

  if (!polygonEnabled) {
    // Add click listener for map, to add points to polygon
    google.maps.event.addListener(map, 'click', function(e) {
      var currentPoints = polygon.getPath()
      currentPoints.push(e.latLng)
    })

    // Add mouseover event to polygon
    polygon.addListener('mouseover', function(e){
      var entrancePoint = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }

      // Add marker at location where mouse entered
      var marker = new google.maps.Marker({
        position: entrancePoint,
        map: map
      })

      // Change color to different one
      polygon.setOptions({
        strokeColor: fillColor,
        fillColor: strokeColor
      })
    })

    // Add mouseout listener to revert color back to normal
    polygon.addListener('mouseout', function() {
      polygon.setOptions({
        strokeColor: strokeColor,
        fillColor: fillColor
      })
    })

    polygonEnabled = true
  }

  else {
    google.maps.event.clearListeners(polygon, 'mouseover')
    google.maps.event.clearListeners(polygon, 'mouseout')
    polygonEnabled = false
  }
}
