// Initialize Firebase
var config = {
    apiKey: "AIzaSyD6ZCrzx8ry_zFNeebYMwHAda2BMM1ujcM",
    authDomain: "project-1-a0bb8.firebaseapp.com",
    databaseURL: "https://project-1-a0bb8.firebaseio.com",
    projectId: "project-1-a0bb8",
    storageBucket: "project-1-a0bb8.appspot.com",
    messagingSenderId: "262887889800"
};
firebase.initializeApp(config);

var database = firebase.database();



$(document).ready(function () {

    // This will display information based on geolocation
    // Currently is does not pull geolocation
    $("#check-if-safe-now").on("click", function () {
        $(".nowContainer").css("display", "block");
        $(".laterContainer").css("display", "none");
        // $(".beginningForm").css("border", "solid grey 4px");
    });

    // Once clicked, this will display the zipcode form and enter button
    $("#check-if-safe-later").on("click", function () {
        $(".nowContainer").css("display", "none");
        $(".zipcodeForm").css("display", "block");
        $("#check-if-safe-later").css("display", "none");

    });

    // First API Call is here
    // This should be attached to the check-if-safe-now event
    var apiKey = "J4QW6QeT5JkCYP4vnCmUTpdF4";
    var queryURL = "https://data.cityoforlando.net/resource/6qd7-sr7g.json?$$app_token=" + apiKey + "$where=date between '2015-01-10T12:00:00' and '2015-01-10T14:00:00'";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
    $("#check-for-resources").on("click", function (e) {
        e.preventDefault();
        $(".resourceContainer").toggle();
    })



    var zipInput = $("#grid-zip").val().trim();

    // When the check-if-safe-zipcode button is clicked it adds the zip code to the firebase database
    $("#check-if-safe-zipcode").on("click", function (event) {
        event.preventDefault();

            $(".laterContainer").css("display", "block");
            $(".nowContainer").css("display", "none");
            $("#zip-here").text(zipInput);
            database.ref().on("value", function(snapshot) {
                var s = snapshot.val();
                console.log(s.zipInput);

            });
    });

    // When you want to add a comment it will add a comment and display comments for that zipcode.
    $(".addComment").on("click", function (e) {
        e.preventDefault();
    
        var comment = $("#newComment").val().trim();
        database.ref().push({
            zipCode: zipInput,
            comment: comment,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    // Firebase event listener .on(child_added)
    database.ref().on("child_added", function (snapshot) {
        var snap = snapshot.val();
        var deleteKey = snapshot.key;
        console.log(snap);

        // This function will display the comment for that zip code and a delete button for each comment
        // currently displays all comments for all zip codes
        $(".comment-view").append("<br> <div> Comment: " + snap.zipCode + "  <button id='" + deleteKey + "' class='delete'>Delete</button></div>");

        // Below throws an error message if something has gone wrong
    }, function (errorObject) {
        console.log("Errors handled: ", + errorObject.code);
    });

    // This function will delete "this" comment
    $(".comment-view").on("click", ".delete", function (e) {
        e.preventDefault();
        var keyToDelete = $(this).attr("id");
        database.ref(keyToDelete).remove()
            .then($(this).closest('div').remove());
    });

    // Ajax call

    // mapboxgl.accessToken = 'pk.eyJ1Ijoia2l0eWthdDMyNCIsImEiOiJjanIxOWE1cTgwaGNoM3p0Y2RjcjRpOWU1In0.ECL7UrpjDznPgiDynCKVmg';
    // var map = new mapboxgl.Map({
    //     container: 'map', // container id
    //     style: 'mapbox://styles/mapbox/streets-v9',
    //     center: [-96, 37.8], // starting position
    //     zoom: 3 // starting zoom
    // });

    // // Add geolocate control to the map.
    // map.addControl(new mapboxgl.GeolocateControl({
    //     positionOptions: {
    //         enableHighAccuracy: true
    //     },
    //     trackUserLocation: true
    // }));

    // map.addControl(new mapboxgl.AttributionControl({
    //     compact: true
    // }));
    // $("#map").append(map);

    // var options = {
    //     enableHighAccuracy: true,
    //     timeout: 5000,
    //     maximumAge: 0
    //   };

    //   function success(pos) {
    //     var crd = pos.coords;

    //     console.log('Your current position is:');
    //     console.log(`Latitude : ${crd.latitude}`);
    //     console.log(`Longitude: ${crd.longitude}`);
    //     console.log(`More or less ${crd.accuracy} meters.`);
    //   }

    //   function error(err) {
    //     console.warn(`ERROR(${err.code}): ${err.message}`);
    //   }

    //   mapboxgl.getCurrentPosition(success, error, options);
});