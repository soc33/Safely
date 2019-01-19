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
    var queryURL = "https://data.cityoforlando.net/resource/6qd7-sr7g.json?$where=case_date_time > '2017' and case_offense_charge_type = 'Committed' and case_offense_category = 'Burglary' and within_circle(location , 28.538336, -81.379234, 200 ) ";
    $("#check-if-safe-now").on("click" , function(event){
        

    
    $.ajax({
        url: queryURL,
        method: "GET" 
    }).then(function (response) { 
        
       var results = response;
       console.log(results);
    
    });
});

$("#check-if-safe-zipcode").on("Click", function(event){
    var queryURL = 'https://api.opencagedata.com/geocode/v1/json?q=PLACENAME&key=278527ab562a439fb356e1ca002242fe'

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
    })
})

});