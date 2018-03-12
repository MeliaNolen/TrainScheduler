          
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDvfNjbVU3emLAO465hJ3gvG8KmkaYH1XA",
    authDomain: "trainscheduler-c2b71.firebaseapp.com",
    databaseURL: "https://trainscheduler-c2b71.firebaseio.com",
    projectId: "trainscheduler-c2b71",
    storageBucket: "trainscheduler-c2b71.appspot.com",
    messagingSenderId: "1025594701340"
};
firebase.initializeApp(config);

var database = firebase.database();

$(".btn").on("click", function() {
    event.preventDefault();

    // Grab input
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var time = $("#time").val().trim();
    var frequency = $("#frequency").val().trim();
        
    // Pushing data to firebase
    database.ref().push({
        trainName: trainName,
        destination: destination,
        time: time,
        frequency: frequency
    });

    //Clearing input boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");

});

database.ref().on("child_added", function(snapshot) {
    console.log("Time of first train: " + snapshot.val().time);
    // Time user inputs of the first train
    var timeConverted = moment(snapshot.val().time, "HH:mm").subtract(1, "years");
    console.log(moment(timeConverted));

    // Console the current time 
    console.log("Current time: " + moment(moment()).format("HH:mm"));
    
    // Number of minutes between first train and current time
    var diff = moment().diff(moment(timeConverted), "minutes");
    console.log("Difference: " + diff);

    // Number of minutes since most recent train
    var remainder = diff % snapshot.val().frequency;
    console.log("Minutes since most recent train: " + remainder);

    // Minutes until next train
    var minUntilNextTrain = snapshot.val().frequency - remainder;
    console.log("Minutes until next train: " + minUntilNextTrain);

    // time next train will arrive
    var nextTrain = moment().add(minUntilNextTrain, "minutes").format("hh:mm A");
    console.log("Arrival: " +nextTrain);

    // Display input values FROM FIREBASE
    $("tbody").append("<tr>" + "<td>" + snapshot.val().trainName + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + snapshot.val().frequency + "</td>" +
        "<td>" + nextTrain + "</td>" +
        "<td>" + minUntilNextTrain + "</td>");
    
    // Error handling
    }, function(errorObject) {
        console.log("Errors: " + errorObject.code);
});
