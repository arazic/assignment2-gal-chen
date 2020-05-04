

var user = { userName: "p", password: "p", firstName: "p", lastName: "p", email: "p@gmail.com", date: "2020-01-01" }
var allUsers = [];
allUsers.push(user);

function logFunc()
 {
    var userNameLog = document.getElementById("userNameLogIn");
    var passwordLog = document.getElementById("passwordLogIn");
    var label = document.getElementById("connected");
    if (userNameLog.value.length < 1)
    {
        alert("please enter user name");
        return;
    }
    var pass = passwordLog.value;
    if (pass.length < 1) {
        alert("please enter password");
        return;
    }
    for (i = 0; i < allUsers.length; i++)
    {
        if (userNameLog.value == allUsers[i]["userName"]) {
            if (passwordLog.value == allUsers[i]["password"]) {
                $("#login").hide();
                $("#signup").hide();
                $("#maingame").hide();
                $("#about").hide();
                $("#settings").show();
                alert("You start the game! \n break a leg!");
                label.textContent="welcome " + userNameLog.value;
                document.getElementById('userNameLogIn').value=null;
                document.getElementById('passwordLogIn').value=null;
                return;
            }
            alert("Your password is incorrect");
            return;
        }
    }
    alert("please sign up first");
    document.getElementById('userName').value=null;
    document.getElementById('password').value=null;
    return;

}


function signingUp() {
    var userName = document.getElementById("userName");
    var password = document.getElementById('password');
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var email = $.trim($("input[name='email']").val());
    var date = new Date($('#date').val());
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    var containsNum = /[0-9]/;
    var containsBigLetters = /[A-Z]/;
    var containsSmallLetters = /[a-z]/;

    var name = userName.value;
    if (userName.value.length < 2) {
        alert("Your user name must be at least 2 characters long!");
        return;
    }

    var pass = password.value;
    if (pass.length >= 6) {
        if (!(containsNum.test(pass))) {
            alert("Your password must contains numbers");
            return;
        }
        if (!((containsBigLetters.test(pass)) || (containsSmallLetters.test(pass)))) {
            alert("Your password must contains letters");
            return;
        }
    }
    else {
        alert("Your password must be at least 6 characters long");
        return;
    }

    if (firstName.value.length < 2) {
        alert("Your first name must be at least 2 characters long");
        return;

    }
    else {
        if (containsNum.test(firstName.value)) {
            alert("Your first name can not include numbers");
            return;

        }
    }

    if (lastName.value.length < 2) {
        alert("Your last name must be at least 2 characters long");
        return;

    }
    else {
        if (containsNum.test(lastName.value)) {
            alert("Your last name can not include numbers");
            return;

        }
    }


    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
        alert("email not valid");
        return;
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        alert("date not valid");
        return;
    }

    var user = {
        userName: userName.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email,
        date: date
    }
    allUsers.push(user);
    alert("you are in!");
    document.getElementById('userName').value=null;
    document.getElementById('password').value=null;
    document.getElementById('firstName').value=null;
    document.getElementById('lastName').value=null;
    document.getElementById('email').value=null;
    document.getElementById('date').value=null;
    loginForm();

};


$(function () {
    $("form[name='login']").validate({
        rules: {
            userName: {
                required: true,
                minlength: 1
            },
            password: {
                required: true,
                minlength: 1
            }
        },
        messages: {
            userName:{
                required: "Please enter user name",
                minlength: "Please enter user name"
            },
            password: {
                required: "Please enter password",
                minlength: "Please enter user name"

            }
        },
        submitHandler: function (form) {
            logFunc();
        }
    });
});


$(function () {
    $("form[name='signup']").validate({
        rules: {
            onclick: false,
            onfocusout: false,
            userName: {
                required: true,
                minlength: 2
            },
            password: {
                required: true,
                minlength: 6,
            },
            firstName: {
                required: true,
                minlength: 2,
            },
            lastName: {
                required: true,
                minlength: 2,
            },
            email: {
                required: true,
                email: true
            }
        },


        messages: {
            userName: {
                required: "Please provide a user name",
                minlength: "Your user name must be at least 2 characters long"
            },
            firstName: {
                required: "Please provide a first name",
                minlength: "Your first name must be at least 2 characters long",
                lettersonly: "Your first name must letters only"
            },
            lastName: {
                required: "Please provide a last name",
                minlength: "Your last name must be at least 2 characters long",
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long",
            },
            email: "Please enter a valid email address"
        },

        submitHandler: function (form) {
            signingUp();
        }
    });
});
