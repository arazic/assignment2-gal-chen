

var user = { userName: "p", password: "p", firstName: "p", lastName: "p", email: "p@gmail.com", date: "2020-01-01" }
var allUsers = [];
allUsers.push(user);
var currentSection= "#welcome";
var gaming= false;

function gameFunc() {
    gaming= true;
    $(currentSection).hide();
    currentSection="#mainGame";
	$(currentSection).show();
	Start();
}

function loginForm() {
    if(gaming){
        exitGame();
        gaming=false;
    }
    $(currentSection).hide();
    currentSection= "#login";
    $(currentSection).show();
}

function signupForm() {
    if(gaming){
        exitGame();
        gaming=false;
    }
    $(currentSection).hide();
    currentSection ="#signup";
    $(currentSection).show();
}

function welcome() {
    if(gaming){
        exitGame();
        gaming=false;

    }
    $(currentSection).hide();
    currentSection=  "#welcome";
    $(currentSection).show();
}

function settings() {
    if(gaming){
        exitGame();
        gaming=false;
    }
    $("#rightButtonCode").css("color", "black");
	$("#leftButtonCode").css("color", "black");
	$("#upButtonCode").css("color", "black");
	$("#downButtonCode").css("color", "black");
    $(currentSection).hide();
    currentSection= "#settings";
    $(currentSection).show();
}


function play() {
    var label = document.getElementById("connected");

    if(label.textContent== "welcome guest"){
        alert("Please login first");
    }
    else{
        alert("You start the game! \n break a leg!");
        settings();
    }
}


function aboutForm() {
    $("#about").show();
    var modal = document.getElementById("about");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    addEventListener('keyup', function (event) {
        if (event.keyCode == 27) {
            closeAbout();
        }
    })

}

function closeAbout() {
    var modal = document.getElementById("about");
    modal.style.display = "none";
}




