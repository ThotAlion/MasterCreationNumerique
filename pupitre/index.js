console.log("top");
var listMotors = ["m1", "m2", "m3", "m4", "m5", "m6"];
// IP of the robot
var IProbot = "10.0.0.110:8080";
var mesPos = 0;
var active = false;

// function to make a pause. Delay is in milliseconds
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// function to led all the leds of the robot to a certain color (off sets the LED off)
setLed = function (IP, listLED) {
    for (im = 0; im < listMotors.length; im++) {
        m = listMotors[im];
        val = listLED[im];
        fetch("http://" + IP + "/motors/" + m + "/registers/led/value.json", {
            method: 'POST',
            body: '"' + val + '"',
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
    }
}

// function to enable the motors to the current position and set moving speed to 0 (which means the higher speed possible)
enable = function (IP) {
    active = true;
    for (im = 0; im < listMotors.length; im++) {
        m = listMotors[im];
        fetch("http://" + IP + "/motors/" + m + "/registers/compliant/value.json", {
            method: 'POST',
            body: "false",
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
            .catch(err => console.log(err))
        fetch("http://" + IP + "/motors/" + m + "/registers/moving_speed/value.json", {
            method: 'POST',
            body: "0",
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
            .catch(err => console.log(err))
    }
}

// function to disble the motors 
disable = function (IP) {
    active = false;
    for (im = 0; im < listMotors.length; im++) {
        m = listMotors[im];
        fetch("http://" + IP + "/motors/" + m + "/registers/compliant/value.json", {
            method: 'POST',
            body: "true",
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
            .catch(err => console.log(err))
    }
}

// function to set the motors to a given position in degrees
setPos = function (IP, listPos) {
    for (im = 0; im < listMotors.length; im++) {
        m = listMotors[im];
        val = listPos[im];
        if (~isNaN(val)) {
            fetch("http://" + IP + "/motors/" + m + "/registers/goal_position/value.json", {
                method: 'POST',
                body: val.toString(),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            })
                .catch(err => console.log(err))
        }
    }
}

// function to recup the motor positions in a variable mesPos
getPos = function (IP) {
    mesPos = {};
    for (im = 0; im < listMotors.length; im++) {
        let m = listMotors[im];
        fetch("http://" + IP + "/motors/" + m + "/registers/present_position/value.json", {
            method: 'GET',
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
            .then(res => res.json())
            .then(data => {
                mesPos[m] = Math.round(data.present_position);
                document.getElementById("positions").innerHTML = "[" + mesPos.m1 + "," + mesPos.m2 + "," + mesPos.m3 + "," + mesPos.m4 + "," + mesPos.m5 + "," + mesPos.m6 + "]";
            });
    }
}

// function to set the motors to a given position in degrees in a given time
gotoPos = function(IP,listPos,duree){
    if(active == false){
        alert("Le robot n'est pas activé.");
    }else{
        if(mesPos==0){
            alert("Lire les positions pour la première pose.");
        }else{
            let t0 = Date.now();
            while(Date.now()-t0<(duree*1000)){
                let b=(Date.now()-t0)/(duree*1000);
                let a = [b*listPos[0]+(1-b)*mesPos.m1,
                    b*listPos[1]+(1-b)*mesPos.m2,
                    b*listPos[2]+(1-b)*mesPos.m3,
                    b*listPos[3]+(1-b)*mesPos.m4,
                    b*listPos[4]+(1-b)*mesPos.m5,
                    b*listPos[5]+(1-b)*mesPos.m6]
                setPos(IP,a);
                sleep(50);
            }
            mesPos.m1 = listPos[0];
            mesPos.m2 = listPos[1];
            mesPos.m3 = listPos[2];
            mesPos.m4 = listPos[3];
            mesPos.m5 = listPos[4];
            mesPos.m6 = listPos[5];
        }
    }
}
// gotoPos = function (IP, listPos, duree) {
//     val = {}
//     val.motors = ["m1","m2","m3","m4","m5","m6"];
//     val.positions = listPos;
//     val.duration = duree;
//     val.wait = "true";
//     console.log(val);
//     console.log(val.toString());
//     fetch("http://" + IP + "/motors/goto.json", {
//         method: 'POST',
//         body: JSON.stringify(val),
//         headers: { "Content-Type": "application/json" }
//     })
//     .catch(err => console.log(err))
// }

// interface specification

document.getElementById("bouton1").addEventListener("click", function (evt) {
    disable(IProbot);
});
document.getElementById("bouton2").addEventListener("click", function (evt) {
    enable(IProbot);
});
document.getElementById("bouton3").addEventListener("click", function (evt) {
    setLed(IProbot, ["off", "off", "off", "off", "off", "off"]);
});
document.getElementById("bouton4").addEventListener("click", function (evt) {
    setLed(IProbot, ["red", "red", "red", "red", "red", "red"]);
});
document.getElementById("bouton5").addEventListener("click", function (evt) {
    gotoPos(IProbot, [0,37,20,0,-12,1], 5); //fleur
});
document.getElementById("bouton6").addEventListener("click", function (evt) {
    gotoPos(IProbot, [5,37,-9,-3,58,-21], 1); //init
    gotoPos(IProbot, [-12,98,-52,-4,-39,54], 1); //init
    gotoPos(IProbot, [-12,98,-52,-4,-40,-21], 1); //init
    gotoPos(IProbot, [-9,-55,-53,-11,-48,88], 0.1); //init



});
document.getElementById("bouton7").addEventListener("click", function (evt) {
    getPos(IProbot);
});