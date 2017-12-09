"use strict";

var gl;
var canvas;
var answerColor;
var userColor = chroma([0, 0, 0]);
var firstPress = false;
var gameOver = false;
var increment = 0.05;

var paintRed = chroma([255, 0, 0]);
var paintBlue = chroma([0, 0, 255]);
var paintYellow = chroma([255, 255, 0]);

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
    answerColor = chroma.random();

    // HTML button event listeners
    document.getElementById( "addA" ).onclick = function() { mixColor( paintRed ); };
    document.getElementById( "addB" ).onclick = function() { mixColor( paintYellow ); };
    document.getElementById( "addC" ).onclick = function() { mixColor( paintBlue ); };

    render();
    
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

// Mix color
function mixColor(paint) {
    // Generate a ball of color 'paint' and let it fall

    // Update userColor
    if (firstPress) {
        userColor = paint;
        firstPress = false;
        return;
    }
    userColor = chroma.mix( userColor, paint, 'lab' );
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    setTimeout( function() {requestAnimFrame(render);}, 1000/300); // 300 fps
};
