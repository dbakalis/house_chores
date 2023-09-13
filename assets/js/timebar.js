var yourDateToGo = new Date();                              // here you're making new Date object
yourDateToGo.setMinutes(yourDateToGo.getMinutes() + 30);    // your're setting date in this object 1 day more from now. You can change number of minues to go by putting any number in place of 30

// get the logout url from topbar
var myLogoutUrl = document.getElementById("topbarLogOutURL").value;

// you're making an interval - a thing, that is updating content after number of miliseconds, that you're writing after comma as second parameter
var timing = setInterval(
    function () {

        var currentDate = new Date().getTime();                                         // same thing as above
        var timeLeft    = yourDateToGo - currentDate;                                   // difference between time you set and now in miliseconds

        var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));                        // conversion miliseconds on days 
        if (days < 10)
            days="0"+days;                                                              // if number of days is below 10, programm is writing "0" before 9, that's why you see "09" instead of "9"
        
        var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));  // conversion miliseconds on hours
        if (hours < 10)
            hours="0"+hours;
        
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));          // conversion miliseconds on minutes 
        if (minutes < 10)
            minutes="0"+minutes;
    
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);                      // conversion miliseconds on seconds
        if (seconds < 10)
            seconds="0"+seconds;

            document.getElementById("countdownTopBar").innerHTML = minutes + "m " + seconds + "s"; // putting number of days, hours, minutes and seconds in div, 
            // document.getElementById("countdownTopBar").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s"; // putting number of days, hours, minutes and seconds in div, 
           
            //which id is countdownTopBar
            if (timeLeft <= 0) {
                //go to logout
                clearInterval(timing);
                document.getElementById("countdownTopBar").innerHTML = "Ο χρόνος έληξε";       // if there's no time left, programm in this 2 lines is clearing interval (nothing is counting now) and you see "It's over" instead of time left
                
                alert("Ο χρόνος έληξε. Εξοδος από το σύστημα Διαχείρισης");
                window.location.href = myLogoutUrl;
            }
}, 1000);