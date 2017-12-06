"use strict";

var gl;
var canvas;
var answerColor = [];
var userColor   = [];

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
    answerColor = [ Math.random(), Math.random(), Math.random ];

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
    if( Math.abs( answerColor[0] - userColor[0]) <= range &&
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

// User can start over
function resetColor() {
    
}


var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    setTimeout( function() {requestAnimFrame(render);}, 1000/300); // 300 fps
};
