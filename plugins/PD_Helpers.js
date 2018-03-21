//=============================================================================
// SD_Helpers.js
//=============================================================================
/*:
 * @plugindesc C1 - Some useful functions that are used by the system.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

var PD=PD||{};
PD.Helpers=PD.Helpers||{};
/**
 * @function randomInteger
 * @description Returns a random integer between min and max included
 * @param {number} min - The minimun number that can be returned by the call
 * @param {number} max - The maximun number that can be returned by the call
 * @returns {number} A random integer between min and max (both included)
 */
PD.Helpers.randomInteger=function(min, max){
    if(max==undefined || max==null){
        max=min;
        min=0;
    }
    return Math.floor(Math.random()*(max-min+1)+min);
}
/**
 * @function randomFrom
 * @description Returns a random element from listToPickFrom.
 * @function randomFrom
 * @param {array} listToPickFrom - The list of elements to pick from.
 * @returns A random element in listToPickFrom.
 */
PD.Helpers.randomFrom=function(listToPickFrom){
    var min=0;
    var max=listToPickFrom.length-1;
    return listToPickFrom[PD.Helpers.randomInteger(min,max)];
}
/**
 * @function randomFromWithWeight
 * @description Returns a random element from listToPickFrom using different weights (chances to be picked) for each element.
 * @param {Object[]} listToPickFrom - The list of elements to pick from.
 * @param {number} listToPickFrom[].weightProperty - A property inside each element in the list that should determine its weight.
 * @param {string} weightProperty - The name of the weightProperty of the elements in the array.
 * @returns A random element in listToPickFrom using the weigths given.
 */
PD.Helpers.randomFromWithWeight=function(listToPickFrom, weightProperty){
    var sumOfWeights = listToPickFrom.reduce(function(memo, elm) {
        return memo + elm[weightProperty];
    }, 0);
    var rng = Math.floor(Math.random() * (sumOfWeights + 1));
    var findFnc = function(el) {
        rng -= el[weightProperty];
        return rng <= 0;
    };
    return listToPickFrom.find(findFnc);
}
/**
 * @function randomChance
 * @description Returns true with chances probabiliy
 * @param {number} chances - Chance of returning true (over 100).
 * @returns Returns true with chances probabiliy or false
 */
PD.Helpers.randomChance=function(chances){
    return PD.Helpers.randomInteger(100)<=chances;
}
/**
 * @function shuffleArray
 * @description Returns a suffled (each element of the array placed in a random position) version of the input.
 * @param {array} input - The array to suffle.
 * @returns Returns the shuffled array.
 */
PD.Helpers.shuffleArray=function(input){
    var out=input;
    var j, x, i;
    for (i = out.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = out[i];
        out[i] = out[j];
        out[j] = x;
    }
    return out;
}
/**
 * @function transposeArray
 * @description Returns a transposed (each axis swapped) version of the input.
 * @param {array[]} input - The two dimensional array to transpose.
 * @returns Returns the transposed array.
 */
PD.Helpers.transposeArray=function(a){
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}
