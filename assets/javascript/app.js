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
var zipInput;
var zipcode;
var zipcodeMurderStats = 0;
var zipcodeKidnappingStats = 0;
var zipcodeBurglaryStats = 0;
var zipcodeTheftStats = 0;
var zipcodeAssaultStats = 0;
var zipcodeArsonStats = 0;
var zipcodeFraudStats = 0;
var zipcodeDrugStats = 0;
var zipcodeOtherStats = 0;


makeChart = function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Arrests documented in this area for a year"
        },
        data: [{
            type: "column",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label}",
            dataPoints: [
                { y: zipcodeMurderStats, label: "Murder" },
                { y: zipcodeKidnappingStats, label: "Kidnapping" },
                { y: zipcodeBurglaryStats, label: "Burglary" },
                { y: zipcodeTheftStats, label: "Theft" },
                { y: zipcodeAssaultStats, label: "Assault" },
                { y: zipcodeArsonStats, label: "Arson" },
                { y: zipcodeFraudStats, label: "Fraud" },
                { y: zipcodeOtherStats, label: "Other Crime" }
            ]
        }]
    });
    chart.render();

}
function mapNow(latitude, longitude) {
    var map = L.map('map-view').setView([28.5383, -81.3792], 10);

    var layer =
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup("Latitude : " + latitude + "Longitude : " + longitude)
        .openPopup();

};
function mapLater(latitude, longitude) {
    console.log("Hello");
    var map = L.map('map-view2').setView([28.5383, -81.3792], 10);

    var layer =
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup("Latitude : " + latitude + "Longitude : " + longitude)
        .openPopup();

};


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
                $(".nowContainer").css("background-color", "rgb(253, 114, 114)");
            } else if (response2.length > 30) {
                $("#yellowAlert").show();
                $("#redAlert").hide();
                $("#greenAlert2").hide();
                $(".nowContainer").css("background-color", "rgb(255,255,153)");
            } else {
                $("#greenAlert2").show();
                $("#yellowAlert").hide();
                $("#redAlert").hide();
                $(".nowContainer").css("background-color", "rgb(167, 253, 150)");
            }
        });
    }

    // making the API calls to both the opencage to display the zip and Crime data to decide which modal to show after grabbing 
    function usePosition(position) {
        var userLat = position.coords.latitude;
        var userLong = position.coords.longitude;
        mapNow(userLat, userLong);


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
                $(".nowContainer").css("background-color", "rbg(253, 114, 114)");
            } else if (response.length > 0) {
                $("#yellowAlert2").show();
                $("#redAlert2").hide();
                $("#greenAlert2").hide();
                $("#redAlert").hide();
                $("#yellowAlert").hide();
                $(".nowContainer").css("background-color", "rgb(255,255,153)");
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
            zipcode = response.results[0].components.postcode;
            console.log(response);
            console.log(zipcode);
            $("#zip-here").text("You are in " + zipcode + " Zipcode");

        });

    }

    // This will display information based on geolocation
    $("#check-if-safe-now").on("click", function (e) {
        e.preventDefault();
        getLocation();
        $(".beginningForm").addClass("lg:w-1/4 md:w-1/6");
        $("#check-if-safe-now").css("display", "none");
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

    // When the check-if-safe-zipcode button is clicked it adds the zip code to the firebase database
    $("#check-if-safe-zipcode").on("click", function (event) {
        $(".beginningForm").addClass("lg:w-1/4 md:w-1/6");
        zipcodeArsonStats = 0;
        zipcodeAssaultStats = 0;
        zipcodeBurglaryStats = 0;
        zipcodeFraudStats = 0;
        zipcodeKidnappingStats = 0;
        zipcodeMurderStats = 0;
        zipcodeTheftStats = 0;
        zipcodeDrugStats = 0;
        zipcodeOtherStats = 0;
        event.preventDefault();
        zipInput = $("#grid-zip").val().trim();
        $("#zip-here2").text(zipInput);
        $(".comment-view").empty();
        // Firebase event listener .on(child_added)
        database.ref().on("child_added", function (snapshot) {
            var snap = snapshot.val();
            var deleteKey = snapshot.key;
            console.log(snap);
            if (snap.zipCode == zipInput) {
                // This will display each comment for the zip code input by the user and generate a delete button for each comment
                $(".comment-view").append("<br> <div class='border-2 w-full p-6'> Comment: " + snap.comment + "  <button id='" + deleteKey + "' class='rounded-full bg-grey delete'> Delete </button></div>");
            }
            // Below throws an error message if something has gone wrong
        }, function (errorObject) {
            console.log("Errors handled: ", + errorObject.code);
        });

        // displaying the correct container
        $(".laterContainer").css("display", "block");
        $(".nowContainer").css("display", "none");

        var queryURL3 = 'https://api.opencagedata.com/geocode/v1/json?q=' + zipInput + '&key=278527ab562a439fb356e1ca002242fe&pretty=1&limit=1&countrycode=us&state_code=FL';

        $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function (response3) {
            console.log(response3)
            var lat = response3.results[0].geometry.lat;
            var long = response3.results[0].geometry.lng;
            console.log(lat)
            console.log(long)
            // mapLater(lat, long);


            // making the call to the crime data API to determine statistics of the area
            var queryURL2 = "https://data.cityoforlando.net/resource/6qd7-sr7g.json?$where=case_date_time > '2017-01' and case_date_time < '2018-01' and within_circle(location, " + lat + "," + long + ", 1000)&$limit=3000";

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function (response4) {
                console.log(response4);
                var results = response4;
                for (i = 0; i < results.length; i++) {
                    var category = results[i].case_offense_category;
                    switch (category) {
                        case "Homicide":
                            zipcodeMurderStats++;
                            console.log(zipcodeMurderStats);
                            break;
                        case "Arson":
                            zipcodeArsonStats++;
                            break;
                        case "Assault":
                            zipcodeAssaultStats++;
                            break;
                        case "Burglary":
                            zipcodeBurglaryStats++;
                            break;
                        case "Kidnapping":
                            zipcodeKidnappingStats++;
                            break;
                        case "Fraud":
                            zipcodeFraudStats++;
                            break;
                        case "Theft":
                            zipcodeTheftStats++;
                            break;
                        case "Narcotics":
                            zipcodeDrugStats++;
                            break;
                        default:
                            zipcodeOtherStats++;
                            break;
                    }
                }
                makeChart();

            });
            mapLater(lat, long);

        });

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
        $("#newComment").val("");

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

    $(".slider_clock").EasySlides({
        "stepbystep": false,
        "show": 15
    });

});