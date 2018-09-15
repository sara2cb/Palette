/*
 * This scripts creates a palette where the three colors are chose
 * via optimization.
 * Right now it only forms the two colors and find the position in the palette
 */

//All needed variables
var squares
var square1VertexPositionBuffer;
var square1VertexColorBuffer;
var square2VertexPositionBuffer;
var square2VertexColorBuffer;
var square3VertexPositionBuffer;
var square3VertexColorBuffer;
var finalVer;
var circleVertexPositionBuffer;
var circleVertexColorBuffer;
var Index_Buffer;
var indices = [];
var colSq;
var colSq1VertexPositionBuffer;
var colSq1VertexColorBuffer;
var colSq2VertexPositionBuffer;
var colSq2VertexColorBuffer;
var colSq3VertexPositionBuffer;
var colSq3VertexColorBuffer;
var finalVerPositionBuffer;
var finalVerColorBuffer;

//Initialize buffer and define the drawings
function initBuffers() {
    //Create buffers and bind it
    circleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);

    var vertices = [];
    var colors=[];
    var centerX = -0.3;
    var centerY = 0.0;
    var r = 0.6;
    vertices.push(-0.3,0.0,0.0);
    //Vertices of the circle
    for (i = 0; i <= 119; i++){
        vertices.push((centerX + r*Math.cos(i*2*Math.PI/120)),
                      (centerY+ r*Math.sin(i*2*Math.PI/120)),0.0);
    }

    //Indices for creating the circle appropriately
    for(i=1;i<120;i++){
        indices.push(i,i++,0);
    }
    indices.push(120,1,0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    circleVertexPositionBuffer.itemSize = 3;
    circleVertexPositionBuffer.numItems = 121;

    Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Create buffer for the colors
    circleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
    //Define the colors starting from R
    var valR = 1;
    var valG = 0;
    var valB = 0;
    colors.push(1.0,1.0,1.0,1.0);
    //RB
    for (i = 1; i <= 20; i++){
        valB = valB + 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    //B
    for (i = 1; i <= 20; i++){
        valR = valR - 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    //GB
    for (i = 1; i <= 20; i++){
        valG = valG + 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    //G
    for (i = 1; i <= 20; i++){
        valB = valB - 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    //RG
    for (i = 1; i <= 20; i++){
        valR = valR + 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    //R
    for (i = 1; i <= 20; i++){
        valG = valG - 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    circleVertexColorBuffer.itemSize = 4;
    circleVertexColorBuffer.numItems = 121;
}

var read = false;
//Draw circle
function drawScene() {
    //At first I only draw the circle to get the color from there
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0, 0.0, 0.6]);

    drawCircle();
    findColors();
}

//Draw all shapes
function finalDraw(){
    gl.clearColor(1,1,1,1);
    addColSq();
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0, 0.0, 0.6]);
    
        //Draw choosing color squares
    for(i=0; i<squares.length;i++){
       gl.bindBuffer(gl.ARRAY_BUFFER, squares[i][0]);
       gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squares[i][0].itemSize, gl.FLOAT, false, 0, 0);
       gl.bindBuffer(gl.ARRAY_BUFFER, squares[i][1]);
       gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squares[i][1].itemSize, gl.FLOAT, false, 0, 0);
       gl.drawArrays(gl.LINE_LOOP, 0, squares[i][0].numItems);
    }
    
        //Draw the final squares
    for(i=0; i<colSq.length;i++){
       gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][0]);
       gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, colSq[i][0].itemSize, gl.FLOAT, false, 0, 0);
       gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][1]);
       gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colSq[i][1].itemSize, gl.FLOAT, false, 0, 0);
       gl.drawArrays(gl.TRIANGLE_FAN, 0, colSq[i][0].numItems);
    }
    
    //Draw circle
    gl.bindBuffer(gl.ARRAY_BUFFER, newCircleVertexPositionBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, newCircleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, newCircleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, newCircleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLE_STRIP, indices.length,gl.UNSIGNED_SHORT,0);

}

function drawCircle(){
        //Draw circle palette
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, circleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLE_STRIP, indices.length,gl.UNSIGNED_SHORT,0);
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

var colorFin;
var first = true;
var smallSqCoor = [];
// //Define the squares that show the color
function findColors(){
    //Get the coordinates from lastMouse
    initialVer= [(lastMouseX-303)*(2/607), (303-lastMouseY)*(2/607),-0.0];
    cen = Math.sqrt(Math.pow(initialVer[0]-0.3,2)+Math.pow(initialVer[1],2));
    if(disCen > 0.6){
        cen = 0.58
        angleO = getAngle(initialVer[0],initialVer[1]);
        initialVer[0] = (cen * Math.cos(angleO))-0.3;
        initialVer[1] = cen * Math.sin(angleO)
    }
    
    //Find color from the point
    var pixels = new Uint8Array(gl.viewportWidth*gl.viewportHeight*4);
    gl.readPixels(0,0,gl.viewportWidth,gl.viewportHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
        
    //Get the color of the position
    var x = lastMouseX;
    var y = 607-lastMouseY;
    smallSqCoor.push([initialVer[0],initialVer[1]]);
    var index =4*(x+y*gl.viewportWidth);
    var color = [];
    pixelR = pixels[index]/255;
    pixelG = pixels[index+1]/255;
    pixelB = pixels[index+2]/255;
    pixelA = pixels[index+3]/255;
    colorFin= [[pixelR,pixelG,pixelB],[pixelB,pixelR,pixelG],[pixelG,pixelB,pixelR]];
    //Find the other two remaining colors in the drawing
    var found = false;
        for(i = 40; i <400;i++){
           for(j = 500; j>120;j--){
                var index =4*(i+j*gl.viewportWidth);
                    if(round(pixels[index]/255,2) == round(pixelB,2)){
                        if(round(pixels[index+1]/255,2) == round(pixelR,2)){
                            if(round(pixels[index+2]/255,2) == round(pixelG,2)){
                                smallSqCoor.push([(i-303)*(2/607), (j-303)*(2/607),-0.0]);
                                found = true
                            }
                        }
                    }
                    if(found)
                        break;
            }
            if(found)
                break;
        }
    found = false
        for(i = 40; i <400;i++){
            for(j = 500; j>120;j--){
                var index =4*(i+j*gl.viewportWidth);
                if(round(pixels[index]/255,2) == round(pixelG,2)){
                    if(round(pixels[index+1]/255,2) == round(pixelB,2)){
                        if(round(pixels[index+2]/255,2) == round(pixelR,2)){
                            smallSqCoor.push([(i-303)*(2/607), (j-303)*(2/607),-0.0]);
                            found = true
                        }
                    }
                }
                if(found)
                    break;
            }
            if(found)
                break;
        }
        finalDraw();
}

var newCircleVertexColorBuffer;
var newCircleVertexPositionBuffer;
var Index_Buffer;
var indices = [];
function addColSq(){
    //Draw the circle again
    newCircleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, newCircleVertexPositionBuffer);

    var vertices = [];
    var colors=[];
    var centerX = -0.3;
    var centerY = 0.0;
    var r = 0.6;
    vertices.push(-0.3,0.0,0.0);
    for (i = 0; i <= 119; i++){
        vertices.push((centerX + r*Math.cos(i*2*Math.PI/120)),
                      (centerY+ r*Math.sin(i*2*Math.PI/120)),0.0);
    }

    for(i=1;i<120;i++){
        indices.push(i,i++,0);
    }
    indices.push(120,1,0);


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    newCircleVertexPositionBuffer.itemSize = 3;
    newCircleVertexPositionBuffer.numItems = 121;

    Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    newCircleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, newCircleVertexColorBuffer);

    var valR = 1;
    var valG = 0;
    var valB = 0;
    colors.push(1.0,1.0,1.0,1.0);
    for (i = 1; i <= 20; i++){
        valB = valB + 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    for (i = 1; i <= 20; i++){
        valR = valR - 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    for (i = 1; i <= 20; i++){
        valG = valG + 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    for (i = 1; i <= 20; i++){
        valB = valB - 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    for (i = 1; i <= 20; i++){
        valR = valR + 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    for (i = 1; i <= 20; i++){
        valG = valG - 1/20;
        colors.push(valR,valG,valB,1.0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    newCircleVertexColorBuffer.itemSize = 4;
    newCircleVertexColorBuffer.numItems = 121;
    
    
    //Matrix with the buffers of each choosing color square
    squares= [[square1VertexPositionBuffer,square1VertexColorBuffer],
             [square2VertexPositionBuffer,square2VertexColorBuffer],
             [square3VertexPositionBuffer,square3VertexColorBuffer]];
    //Assign the correct position
    for(i = 0; i<squares.length;i++){
        squares[noSquare+i][0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squares[noSquare+i][0]);
        var vertices = [
            smallSqCoor[i][0]-0.02, smallSqCoor[i][1]+0.02,0.0,
            smallSqCoor[i][0]-0.02, smallSqCoor[i][1]-0.02,0.0,
            smallSqCoor[i][0]+0.02, smallSqCoor[i][1]-0.02,0.0,
            smallSqCoor[i][0]+0.02, smallSqCoor[i][1]+0.02,0.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squares[noSquare+i][0].itemSize = 3;
        squares[noSquare+i][0].numItems = 4;
        squares[noSquare+i][1] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squares[noSquare+i][1]);
        var colors = [
            0.2, 0.2, 0.2, 1.00,
            0.2, 0.2, 0.2, 1.00,
            0.2, 0.2, 0.2, 1.00,
            0.2, 0.2, 0.2, 1.00,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        squares[noSquare+i][1].itemSize = 4;
        squares[noSquare+i][1].numItems = 4;
    }

    //Matrix with each square buffer
    colSq= [[colSq1VertexPositionBuffer,colSq1VertexColorBuffer],
            [colSq2VertexPositionBuffer,colSq2VertexColorBuffer],
            [colSq3VertexPositionBuffer,colSq3VertexColorBuffer]];
    //First square vertex
    var sqVertices= [
            0.4,0.7,-0.0,
            0.8,0.7,-0.0,
            0.8,0.3,-0.0,
            0.4,0.3,-0.0];
    var dif = 0;
    for(i = 0; i<colSq.length;i++){
        //Create position buffer
        colSq[i][0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][0]);
        sqVertices = [
            sqVertices[0], sqVertices[1]-dif,-0.0,
            sqVertices[3], sqVertices[4]-dif,-0.0,
            sqVertices[6], sqVertices[7]-dif,-0.0,
            sqVertices[9], sqVertices[10]-dif,-0.0
        ];
        dif = +0.5;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqVertices), gl.STATIC_DRAW);
        colSq[i][0].itemSize = 3;
        colSq[i][0].numItems = 4;

        //Create color buffer
        colSq[i][1] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][1]);
        var colors = [
            colorFin[i][0], colorFin[i][1],colorFin[i][2],pixelA,
            colorFin[i][0], colorFin[i][1],colorFin[i][2],pixelA,
            colorFin[i][0], colorFin[i][1],colorFin[i][2],pixelA,
            colorFin[i][0], colorFin[i][1],colorFin[i][2],pixelA,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colSq[i][1].itemSize = 4;
        colSq[i][1].numItems = 4;
    }
}
