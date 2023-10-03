"use strict";

var mps = [ 500000, 450000, 400000, 350000, 300000, 250000, 200000, 160000, 140000, 120000, 100000, 90000, 80000, 70000, 60000, 55000, 50000, 45000, 40000, 37500, 35000, 32500, 30000, 27500, 26500, 25000, 23500, 22000, 21000, 20000, 19000, 18000, 17000, 16000, 15000, 14500, 14000, 13500, 13000, 12500, 12000, 11500, 11000, 10500, 10000, 9000, 8000, 7000, 6000, 4000, 2000];

// Calculates a catch rate
function calcCR(mousePower, setupPower, setupLuck, anniversaryBool) {
    var eff = 1;
    var origCR = (eff * setupPower + 2 * Math.pow(Math.floor(Math.min(eff, 1.4) * setupLuck), 2))
        / (eff * setupPower + mousePower);
    var finalCR = 0;
    if (anniversaryBool) {
        finalCR = (1 - origCR) * .1 + origCR;
    } else {
        finalCR = origCR;
    }
    return finalCR;
}

function calcMatrix() {
    var setupPower = document.getElementById("setup_power").value;
    var setupLuck = document.getElementById("setup_luck").value;
    var saltStrength = parseInt(document.getElementById("which_charm").value);
    var anniversaryBool = document.getElementById("anniversaryBool").checked ? 1 : 0;
    var sodiumBool = document.getElementById("sodiumBool").checked ? 1 : 0;
    saltStrength += sodiumBool;
    var saltCost = (saltStrength - sodiumBool) / saltStrength;
    var matrix = [[]];
    var minBer = 10000;
    var whichBer = -1;
    var minHunts = 10000;
    var whichHunts = -1;
//    alert("Calculating!");
    for(var saltLevel = 0; saltLevel < mps.length; saltLevel++) {
        var CR = calcCR(mps[saltLevel], setupPower, setupLuck, anniversaryBool);
        var hunts = Math.ceil(1 / CR);
        var berCost = 3*hunts + Math.ceil(saltLevel*saltCost);
        var huntCost = Math.floor(saltLevel / saltStrength) + hunts;
        var thisRow = [
            saltLevel,
            Math.min(Math.round(CR * 100 * 100) / 100, 100),
            hunts,
            berCost,
            huntCost
        ];
        if (berCost < minBer) {
            minBer = berCost;
            whichBer = saltLevel;
//            alert(`Set Ber to ${minBer} for ${whichBer}`);
        }
        if (huntCost < minHunts) {
            minHunts = huntCost;
            whichHunts = saltLevel;
//            alert(`Set hunts to ${minHunts} for ${whichHunts}`);
        }
        matrix.push(thisRow);
//        alert(`Calculated for salt ${saltLevel}`);
    }

//    alert(`Calculated! Hunts is ${minHunts} at salt ${whichHunts}. Ber is ${minBer} for ${whichBer}. Salt Strength: ${saltStrength}`);
    // Update the HTML!
    document.getElementById("minHuntsSeen").innerHTML = minHunts;
    document.getElementById("minHuntsSaltLevel").innerHTML = Math.ceil(whichHunts / saltStrength) * saltStrength;
    document.getElementById("minBerSeen").innerHTML = minBer;
    document.getElementById("minBerSaltLevel").innerHTML = Math.ceil(whichBer / saltStrength) * saltStrength;

    // Make a beautiful table body
    var bodyString = "";
    matrix.forEach((row) => {
        bodyString += "<tr><td>" + row.join("</td><td>") + "</td></tr>\n";
    });
    document.getElementById("resultsBody").innerHTML = bodyString;
}



