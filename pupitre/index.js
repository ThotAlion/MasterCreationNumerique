// IP of the robot
var IProbot = "192.168.1.151:5000";
var mesPos = 0;

// function to make a pause. Delay is in milliseconds
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// function to led all the leds of the robot to a certain color (off sets the LED off)
setLed = function(IP,listLED){
    valstr = JSON.stringify(listLED);
    fetch("http://"+IProbot+"/set_leds",{
        method: 'POST',
        body: valstr,
        headers: {"Content-Type":"application/json;charset=UTF-8"}
    })
    .catch(err => console.log(err));
}

// function to disble the motors
disable = function(IP){
    setPos(IProbot,[[NaN,NaN,NaN,NaN,NaN,NaN,1]]);
}

// function to set the motors to a given position in degrees
setPos = function(IP,listPos){
    valstr = JSON.stringify(listPos);
    fetch("http://"+IProbot+"/set_positions",{
        method: 'POST',
        body: valstr,
        headers: {"Content-Type":"application/json;charset=UTF-8"}
    })
    .catch(err => console.log(err));
}

// function to recup the motor positions in a variable mesPos
getPos = function(IP){
    mesPos={};
    fetch("http://"+IProbot+"/get_positions",{
        method: 'GET',
        headers: {"Content-Type":"application/json;charset=UTF-8"}
    })
    .then(res => res.json())
    .then(data => {
        mesPos.m1 = Math.round(data[0]);
        mesPos.m2 = Math.round(data[1]);
        mesPos.m3 = Math.round(data[2]);
        mesPos.m4 = Math.round(data[3]);
        mesPos.m5 = Math.round(data[4]);
        mesPos.m6 = Math.round(data[5]);
        document.getElementById("positions").innerHTML = "["+mesPos.m1+","+mesPos.m2+","+mesPos.m3+","+mesPos.m4+","+mesPos.m5+","+mesPos.m6+"]";
    })
    .catch(err => console.log(err));
}

// interface specification
document.getElementById("bouton1").addEventListener("click",function (evt){
    disable(IProbot);
});
document.getElementById("bouton3").addEventListener("click",function (evt){
    setLed(IProbot,["off","off","off","off","off","off"]);
});
document.getElementById("bouton4").addEventListener("click",function (evt){
    setLed(IProbot,["red","red","red","red","red","red"]);
});
document.getElementById("bouton5").addEventListener("click",function (evt){
    setPos(IProbot,[[0,0,0,0,0,0,2]]);
});
document.getElementById("bouton6").addEventListener("click",function (evt){
    getPos(IProbot);
});
document.getElementById("bouton7").addEventListener("click",function (evt){
    let chore = []
    chore.push([0,0,0,0,0,0,2]);
    chore.push([0,0,0,0,0,40,1.8]);
    chore.push([0,0,0,0,0,0,1.6]);
    chore.push([0,0,0,0,0,40,1.4]);
    chore.push([0,0,0,0,0,0,1.2]);
    chore.push([0,0,0,0,0,40,1]);
    chore.push([0,0,0,0,0,0,0.8]);
    chore.push([0,0,0,0,0,40,0.6]);
    chore.push([0,0,0,0,0,0,0.4]);
    chore.push([0,0,0,0,0,40,0.2]);
    setPos(IProbot,chore);
});