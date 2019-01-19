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

    $("#check-if-safe-now").on("click", function () {
        $(".nowContainer").css("display", "block");
        $(".laterContainer").css("display", "none");
        $(".beginningForm").css("border", "solid grey 4px");
    });
    $("#check-if-safe-later").on("click", function () {
        $(".nowContainer").css("display", "none");
        $(".zipcodeForm").css("display", "block");
        $("#check-if-safe-later").css("display", "none");

    });
    var x = document.getElementById("zipcode");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        x.innerHTML = "Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude;
    }
    $("#check-if-safe-now").on("click", function (e) {
        e.preventDefault();
        getLocation();
        showPosition();


    });
    // https://api.opencagedata.com/geocode/v1/json?q=PLACENAME&key=278527ab562a439fb356e1ca002242fe


    // https://api.opencagedata.com/geocode/v1/json?q=LAT+LNG&key=278527ab562a439fb356e1ca002242fe


    $("#check-if-safe-zipcode").on("click", function (e) {
        e.preventDefault();
        $(".laterContainer").css("display", "block");
        $(".nowContainer").css("display", "none");
        // var apiKey = "J4QW6QeT5JkCYP4vnCmUTpdF4";
        var queryURL = "https://data.cityoforlando.net/resource/6qd7-sr7g.json?$where=case_date_time > '2017-11' and case_date_time < '2019-02' and case_offense_charge_type = 'Committed' and within_circle(location, 28.460357483, -81.458659246, 1000)";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);


        });
    });

    $(".addComment").on("click", function (e) {
        e.preventDefault();
        var comment = $("#newComment").val().trim();
        database.ref().push({
            comment: comment
        });
    });

    var zipCode = "";

    // When the check-if-safe button is clicked it adds the zip code to the firebase database
    $("#check-if-safe").on("click", function (event) {
        event.preventDefault();

        zipCode = $("#grid-zip").val().trim();

        database.ref().push({
            zipCode: zipCode,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    // Firebase event listener .on(child_added)
    database.ref().on("child_added", function (snapshot) {
        var snap = snapshot.val();
        var deleteKey = snapshot.key;
        console.log(snap);

        // This function will display...
        $(".comment-view").append("<br> <div> SampleUserName: " + snap.comment + "  <button id='" + deleteKey + "' class='delete'>Delete</button></div>");

        // Below throws an error message if something has gone wrong
    }, function (errorObject) {
        console.log("Errors handled: ", + errorObject.code);
    });

    $(".comment-view").on("click", ".delete", function (e) {
        e.preventDefault();
        var keyToDelete = $(this).attr("id");
        database.ref(keyToDelete).remove()
            .then($(this).closest('div').remove());
    });
});