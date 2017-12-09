"use strict";

var gl;
var canvas;
var answerColor = [];
var userColor   = [];
var gameOver = false;
var increment = 0.05;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.85, 0.85, 0.85, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    // Set answerColor to be a random color
    answerColor = [ Math.random(), Math.random(), Math.random() ];

    // Alternative: set answerColor to be a multiple of 'increment'
    // So that it's easier to get the right answer
    for(var i=0; i<3; i++) {
        answerColor[i] = increment * Math.floor( Math.random() * 1.0/0.05 )
    }


    // HTML button event listeners
    document.getElementById( "addA" ).onclick = function() {

    }
    document.getElementById( "addB" ).onclick = function() {

    }
    document.getElementById( "addC" ).onclick = function() {

    }
 
    render();
    
};

// Check user's answer with answerColor
function checkAnswer() {
    var range = 0.05; //Acceptable error margin
    if( Math.abs( answerColor[0] - userColor[0] ) <= range &&
        Math.abs( answerColor[1] - userColor[1] ) <= range &&
        Math.abs( answerColor[2] - userColor[2] ) <= range )
    {
        return true;
    }
    else
    {
        return false;
    }
}

// Return a score out of 100
// Score is the average accuracy
function getScore() {
    var sum = 0;
    for (var i=0; i<3; i++) {
        sum += 1.0 - Math.abs((answerColor[i] - userColor[i]) / answerColor[i]);
    }
    gameOver = true;
    return (sum / 3) * 100;
}

// User can start over
function resetColor() {
    
}


var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    setTimeout( function() {requestAnimFrame(render);}, 1000/300); // 300 fps
};
