"use strict";

var answerColor;
var totalScore = 0;
var totalPossibleScore = 0;
var userColor = chroma([255, 255, 255]);
var gameOver = false;
var increment = 0.05;

var paintRed = chroma([255, 0, 0]);
var paintBlue = chroma([0, 0, 255]);
var paintYellow = chroma([255, 255, 0]);
var paintWhite = chroma([255, 255, 255]);
var paintBlack = chroma([0, 0, 0]);

var blue = 0;
var yellow = 0;

var scene = new THREE.Scene();

var waterMaterial;
var paintdropArray = [];
var buttonPressTimeArray = [];

var addedPaint;
var paintdropContact = false;

window.onload = function init()
{
    // Set answerColor to be a random color
    setGoalColor();

    // HTML button event listeners
    document.getElementById( "red" ).onclick = function() { addPaintdrop( paintRed ); };
    document.getElementById( "yellow" ).onclick = function() { addPaintdrop( paintYellow ); };
    document.getElementById( "blue" ).onclick = function() { addPaintdrop( paintBlue ); };
    document.getElementById( "white" ).onclick = function() { addPaintdrop( paintWhite ); };
    document.getElementById( "black" ).onclick = function() { addPaintdrop( paintBlack ); };

    // submit button listener
    document.getElementById( "submit" ).onclick = function() {
      // get new random color
      setGoalColor();

      // reset paint
      resetColor();

      // update score and score display
      updateScore();
      updateScoreDisplay();
    };

    // reset button event listener
    document.getElementById( "reset" ).onclick = function() { resetColor(); };

};

function setGoalColor() {
  answerColor = chroma.random();
  document.getElementById( "goal-color" ).style.background = answerColor;
}

// updates the score. each round out of 100 points
function updateScore() {
    var distance = chroma.distance( answerColor, userColor, 'lab' ) * (100.0/255.0); // Scale distance to be out of 100

    totalScore = totalScore + (100.0 - distance);
    totalPossibleScore = totalPossibleScore + 100;
}

function updateScoreDisplay() {
  document.getElementById( "current-score" ).innerHTML = (Math.round(totalScore)).toString() + "/" + totalPossibleScore.toString();
}

// User can start over
function resetColor() {
    // reset water back to white
    userColor = chroma([255, 255, 255]);
    waterMaterial.setHex( chromaToHex(userColor) );
    blue = 0;
    yellow = 0;
}

// Add paint drop
function addPaintdrop(paint) {
    addedPaint = paint;

    if (paint == paintYellow) {
      yellow = yellow + 1;
    }
    else if (paint == paintBlue) {
      blue = blue + 1;
    }

    if ((yellow == blue) && (paint == paintYellow || paint == paintBlue)) {
      addedPaint = chroma([0, 255, 0]);
    }

    // Generate a ball representing paint drop of color 'paint' and let it fall
    var ballGeometry = new THREE.SphereGeometry(25, 30, 30);
    var ballMaterial = new THREE.MeshPhongMaterial();
    ballMaterial.color = new THREE.Color( chromaToHex(paint) );

    var sphere = new THREE.Mesh( ballGeometry, ballMaterial );
    scene.add( sphere );
    sphere.position.set(0, 100, 0);
    paintdropArray.push( sphere );
    buttonPressTimeArray.push( Date.now() );
}

function updatePaintdropHeight( uniforms ) {
    var gravity = 0.2;
    for(var p = 0; p < paintdropArray.length; p++) {
        var elapsed = Date.now() - buttonPressTimeArray[p];
        var currDrop = paintdropArray[p];
        var height = 100.0 - gravity * Math.pow( elapsed, 2 ) * (1/1000);
        currDrop.position.set(0, height, 0);

        // if height is lower than a certain value, destroy the ball
        if( height < -50.0 ) {
            scene.remove(currDrop);
            paintdropArray.splice(p, 1);
            buttonPressTimeArray.splice(p, 1);

            uniforms.paintdropPos.value.set( 10000, 10000 );

            paintdropContact = false;

            updatePaint();
            continue;
        }

        // Check if paintdrop touches the water, then update paintdropPos to express ripples
        if( height < 0.0 ) {
            if( !paintdropContact ) {
                uniforms.paintdropPos.value.set( 0, 0 );
                paintdropContact = true;
            }
            else {
                uniforms.paintdropPos.value.set( 10000, 10000 );
            }
        }
    }
}

function updatePaint() {
    userColor = chroma.mix( userColor, addedPaint, 0.5, 'lab' );
    waterMaterial.setHex( chromaToHex(userColor) );
}

function getWaterMaterial( wm ) {
  waterMaterial = wm;
}

// Parse a chroma object's hex string to a hex integer
// because chroma.hex() returns a string
function chromaToHex(color) {
    return parseInt( color.hex().substring(1), 16 );
}
