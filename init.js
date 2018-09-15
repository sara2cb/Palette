var gl;

//Beginning of the program
function webGLStart() {
    geo = true;
    var canvas = document.getElementById("mycanvas");
    initGL(canvas);
    initShaders();

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    tick();
}

// Initialization of the webgl canvas
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

//Create the shaders from shaderScript
function getShader(gl, id) {
    //Get the script
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    //create the shaders
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    //Define and compile shader
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

//Initialization of the shaders
var shaderProgram;
function initShaders() {
    //Create the program
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    shaderProgram = gl.createProgram();
    //Attach the shaders
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    //Define the shaders attributes
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

var mouseDown = false;
var inSquared = false;
var justArrived = false;
var noSquare = 0;
var lastMouseX = 303;
var lastMouseY = 303;

//Handle maouse when clicked, it gives a new position of the points
function handleMouseDown(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

      if(Math.sqrt(Math.pow((lastMouseX-303)*(2/607)+0.31,2)+Math.pow((303-lastMouseY)*(2/607),2)<=0.39)){
        mouseDown = true;
        noSquare = 0;
        initialVer[0] = lastMouseX;
        initialVer[1] = lastMouseY;
        colorFin = [];
        first = true;
        smallSqCoor = [];
        if(!geo){
            initBuffers();
            drawScene();
        }
        else{
           initBuffersGeo();
           drawSceneGeo(); 
        }
      }
}

//If mouse not clicked set everything to false again
function handleMouseUp(event) {
    mouseDown = false;
    inSquared = false;
    justArrived = false;
}

//When mouse moves nd is clicked redifine the coordinates of the points
function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;
    first = true
    lastMouseX = newX;
    lastMouseY = newY;

    colorFin = [];
    smallSqCoor = [];
    if(!geo){
        initBuffers();
        drawScene();
    }
    else{
        initBuffersGeo();
        drawSceneGeo(); 
    }
    
}

//Action for button, to change mode
function click(){
    console.log("here");
    geo = !geo;
    tick();
}

//Requeste animation
function tick() {
    //Optimized
    if(!geo){
        initBuffers();
        gl.clearColor(0, 0, 0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        requestAnimFrame(tick);
        drawScene();
    }
    //Geometrical
    else{
        initBuffersGeo();
        gl.clearColor(0, 0, 0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        requestAnimFrame(tick);
        drawSceneGeo();
    }
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
