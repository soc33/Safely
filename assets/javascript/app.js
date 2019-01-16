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
    $("#check-if-safe-zipcode").on("click", function (e) {
        e.preventDefault();
        $(".laterContainer").css("display", "block");
        $(".nowContainer").css("display", "none");

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
        console.log(snap);

        // This function will display...
        $("#comment-view").append();

        // Below throws an error message if something has gone wrong
    }, function (errorObject) {
        console.log("Errors handled: ", + errorObject.code);
    });

    // Ajax call
    var apiKey = "";
    var queryURL = "";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
});