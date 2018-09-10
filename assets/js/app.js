$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB7awfEWc9n34nmG55l9RjxLp4Qt9tDWT0",
        authDomain: "ckoyle92.firebaseapp.com",
        databaseURL: "https://ckoyle92.firebaseio.com",
        projectId: "ckoyle92",
        storageBucket: "ckoyle92.appspot.com",
        messagingSenderId: "822904270700"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    //initial variables
    var name = "";
    var destination = "";
    var frequency = "";
    var firstTrain = "";


    // current time at top of page
    function displayRealTime() {
        setInterval(function () {
            $('#currentTime').html(moment().format('hh:mm A'))
        }, 1000);
    }
    displayRealTime();

    //on click-submit train info
    $(".trainBtn").on("click", function (event) {
        event.preventDefault();
        //gets user input
        name = $("#trainName-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrain = $("#trainTime-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        alert(name + " Train has been added to the schedule");

        // push info to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
        });

        // reset train form
        $("#newTrainForm")[0].reset();
    });

    //pulling data from database
    database.ref().on("child_added", function (snapshot) {
        var snap = snapshot.val();

        var tFrequency = snap.frequency;

        var firstTime = snapshot.val().firstTrain;

        //subtacts a yr from first train time, for MATH purpose
        var firstTrainConverted = moment(firstTime, "HH:mm").subtract(1, "years");

        //gets the difference in mins from current time and 1st train
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

        //calcs remaining minutes
        var tRemainder = diffTime % tFrequency;

        //calc mins away
        var minsAway = tFrequency - tRemainder;

        //adds mins away to current time to show next train time
        var nextTrain = moment().add(minsAway, "minutes");

        // table for train schedule
        var tBody = $("tbody");
        var tRow = $("<tr>");

        var trainNames = $("<td>").text(snapshot.val().name);
        var trainDestination = $("<td>").text(snapshot.val().destination);
        var trainFrequency = $("<td>").text(snapshot.val().frequency);
        var trainArrival = $("<td>").text(moment(nextTrain).format("h:mmA"));
        var trainMinsAway = $("<td>").text(minsAway);

        tRow.append(trainNames, trainDestination, trainFrequency, trainArrival, trainMinsAway);
        tBody.append(tRow);
    });

});

//Facebook share
window.fbAsyncInit = function() {
FB.init({
appId : '565239973894983',
autoLogAppEvents : true,
xfbml : true,
version : 'v3.1'
});
};

(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//Facebook share
$('#shareBtn').on("click", function() {
FB.ui({
method: 'share',
display: 'popup',
href: 'https://developers.facebook.com/docs/',
}, function(response){});
})