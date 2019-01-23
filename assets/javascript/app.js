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
var queryURL = "";

$(document).ready(function () {

    // grabbing Geolocation for check if safe now button 
    var x = document.getElementById("zip-here");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(usePosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    function amountOfCrimeAPICall() {
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
            // method: ("GET", "https://cors-anywhere.herokuapp.com/https://maximum.blog/@shalvah/posts")
        }).then(function (response2) {
            console.log(response2);
            if (response2.length > 80) {
                $("#redAlert").show();
                $("#yellowAlert").hide();
                $("#greenAlert2").hide();
            } else if (response2.length > 30) {
                $("#yellowAlert").show();
                $("#redAlert").hide();
                $("#greenAlert2").hide();
            } else {
                $("#greenAlert2").show();
                $("#yellowAlert").hide();
                $("#redAlert").hide();
            }
        });
    }

    // making the API calls to both the opencage to display the zip and Crime data to decide which modal to show after grabbing 
    function usePosition(position) {
        var userLat = position.coords.latitude;
        var userLong = position.coords.longitude;


        queryURL = "https://data.cityoforlando.net/resource/6qd7-sr7g.json?$where=case_date_time > '2016-12' and case_date_time < '2017-01' and case_offense_charge_type = 'Committed' and within_circle(location, " + userLat + ", " + userLong + ", 1000)";
        var dangerousCrimeSearch = " and case_offense_category = 'Arson' or case_offense_category = 'Murder' or case_offense_category = 'Manslaughter' or case_offense_category = 'Rape'";

        $.ajax({
            url: queryURL + dangerousCrimeSearch,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            if (response.length > 10) {
                $("#redAlert2").show();
                $("#yellowAlert2").hide();
                $("#greenAlert2").hide();
                $("#redAlert").hide();
                $("#yellowAlert").hide();
            } else if (response.length > 0) {
                $("#yellowAlert2").show();
                $("#redAlert2").hide();
                $("#greenAlert2").hide();
                $("#redAlert").hide();
                $("#yellowAlert").hide();
            } else {
                $("#yellowAlert2").hide();
                $("#redAlert2").hide();
                amountOfCrimeAPICall();
            }
        });

        // then make the call to the Opencage API to convert the lat and long to a zipcode to show the user

        var queryURL4 = "https://api.opencagedata.com/geocode/v1/json?q=" + userLat + "," + userLong + "&key=278527ab562a439fb356e1ca002242fe&pretty=1";
        $.ajax({
            url: queryURL4,
            method: "GET"

        }).then(function (response) {
            var zipcode = response.results[0].components.postcode;
            console.log(response);
            console.log(zipcode);
            $("#zip-here").text(zipcode);

        });

    }

    // This will display information based on geolocation
    $("#check-if-safe-now").on("click", function (e) {
        e.preventDefault();
        getLocation();
        $(".nowContainer").css("display", "block");
        $(".laterContainer").css("display", "none");
        $(".beginningForm").css("border", "solid grey 4px");
    });

    // Once clicked, this will display the zipcode form and enter button
    $("#check-if-safe-later").on("click", function () {
        $(".nowContainer").css("display", "none");
        $(".zipcodeForm").css("display", "block");
        $("#check-if-safe-later").css("display", "none");

    });

    // When the check-if-safe-zipcode button is clicked it adds the zip code to the firebase database
    $("#check-if-safe-zipcode").on("click", function (event) {
        event.preventDefault();
        var zipInput = $("#grid-zip").val().trim();
        $("#zip-here2").text(zipInput);
        $(".comment-view").empty();
        // Firebase event listener .on(child_added)
        database.ref().on("child_added", function (snapshot) {
            var snap = snapshot.val();
            var deleteKey = snapshot.key;
            console.log(snap);
            if (snap.zipCode == zipInput) {
                console.log("if");
                // This will display each comment for the zip code input by the user and generate a delete button for each comment
                $(".comment-view").append("<br> <div> Comment: " + snap.comment + "  <button id='" + deleteKey + "' class='rounded-full bg-blue delete'>Delete</button></div>");
            } else {
                console.log("else");
            }
            // Below throws an error message if something has gone wrong
        }, function (errorObject) {
            console.log("Errors handled: ", + errorObject.code);
        });

        var queryURL3 = 'https://api.opencagedata.com/geocode/v1/json?q=' + zipInput + '&key=278527ab562a439fb356e1ca002242fe&pretty=1&limit=1&countrycode=us';

        $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function (response3) {
            console.log(response3)
            var lat = response3.results[0].geometry.lat;
            var long = response3.results[0].geometry.lng;
            console.log(lat)
            console.log(long)


            // displaying the correct container
            $(".laterContainer").css("display", "block");
            $(".nowContainer").css("display", "none");


            // making the call to the crime data API to determine statistics of the area
            var queryURL2 = "https://data.cityoforlando.net/resource/6qd7-sr7g.json?$where=case_date_time > '2017-01' and case_date_time < '2018-01' and case_offense_charge_type = 'Committed' and within_circle(location, " + lat + "," + long + ", 7000)";

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function (response4) {
                console.log(response4);

            });
        });
        //then hopefully populating a graph with the response information

    });

    // When you want to add a comment it will add a comment and display comments for that zipcode.
    $(".addComment").on("click", function (e) {
        e.preventDefault();
        var zipInput = $("#grid-zip").val().trim();
        var comment = $("#newComment").val().trim();
        database.ref().push({
            zipCode: zipInput,
            comment: comment,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });

    // This function will delete "this" comment
    $(".comment-view").on("click", ".delete", function (e) {
        e.preventDefault();
        var keyToDelete = $(this).attr("id");
        database.ref(keyToDelete).remove()
            .then($(this).closest('div').remove());
    });

    // button to display the choices for more resources for help
    $("#check-for-resources").on("click", function (e) {
        e.preventDefault();
        $(".resourceContainer").toggle();
    });

});