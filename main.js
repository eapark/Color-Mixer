"use strict";

var answerColor;
var userColor = chroma([255, 255, 255]);
var gameOver = false;
var increment = 0.05;

var paintRed = chroma([255, 0, 0]);
var paintBlue = chroma([0, 0, 255]);
var paintYellow = chroma([255, 255, 0]);

var scene = new THREE.Scene();

var paintdropArray = [];
var buttonPressTimeArray = [];

var addedPaint;

window.onload = function init()
{
    // Set answerColor to be a random color
    answerColor = chroma.random();

    // HTML button event listeners
    document.getElementById( "red" ).onclick = function() { addPaintdrop( paintRed ); };
    document.getElementById( "green" ).onclick = function() { addPaintdrop( paintYellow ); };
    document.getElementById( "blue" ).onclick = function() { addPaintdrop( paintBlue ); };    
};

// Return a score out of 100
function getScore() {
    var distance = chroma.distance( answerColor, userColor, 'lab' ) * (100.0/255.0); // Scale distance to be out of 100
    return 100.0 - distance;
}

// User can start over
function resetColor() {
    // Make water clear
}

// Add paint drop
function addPaintdrop(paint) {
    addedPaint = paint;

    // Generate a ball representing paint drop of color 'paint' and let it fall
    var ballGeometry = new THREE.SphereGeometry(50, 30, 30);
    var ballMaterial = new THREE.MeshPhongMaterial();
    ballMaterial.color = new THREE.Color( chromaToHex(paint) );

    var sphere = new THREE.Mesh( ballGeometry, ballMaterial );
    scene.add( sphere );
    sphere.position.set(0, 100, 0);
    paintdropArray.push( sphere );
    buttonPressTimeArray.push( Date.now() );
}

function updatePaintdropHeight( waterMaterial, uniforms ) {
    var gravity = 0.2;
    for(var p = 0; p < paintdropArray.length; p++) {
        var elapsed = Date.now() - buttonPressTimeArray[p];
        var currDrop = paintdropArray[p];
        var height = 100.0 - gravity * Math.pow( elapsed, 2 ) * (1/1000);
        currDrop.position.set(0, height, 0);

        // if height is lower than a certain value, destroy the ball
        if(height < -50.0 ) {
            scene.remove(currDrop);
            paintdropArray.splice(p, 1);
            buttonPressTimeArray.splice(p, 1);

            //uniforms.paintdropPos.value.set( 10000, 10000 );
            //console.log(uniforms.paintdropPos.value);

            updatePaint( waterMaterial );
        }
        if(height < 0.0) {
            //uniforms.paintdropPos.value.set(0, 0);
        }
    }
}

function updatePaint( waterMaterial ) {
    userColor = chroma.mix( userColor, addedPaint, 0.5, 'lab' );
    waterMaterial.setHex( chromaToHex(userColor) );
}

// Parse a chroma object's hex string to a hex integer
// because chroma.hex() returns a string
function chromaToHex(color) {
    return parseInt( color.hex().substring(1), 16 );
}