//Declaration of variables
var squares
var square1VertexPositionBuffer;
var square1VertexColorBuffer;
var square2VertexPositionBuffer;
var square2VertexColorBuffer;
var square3VertexPositionBuffer;
var square3VertexColorBuffer;
var finalVer;
var hexagonVertexPositionBuffer;
var hexagonVertexColorBuffer;
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

function initBuffersGeo() {
    //Define circle in the buffer
    hexagonVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexPositionBuffer);
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
    //Indices so that the vertex colors are correct
    for(i=1;i<120;i++){
        indices.push(i,i++,0);
    }
    indices.push(120,1,0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    hexagonVertexPositionBuffer.itemSize = 3;
    hexagonVertexPositionBuffer.numItems = 121;
    Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Color buffer
    hexagonVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexColorBuffer);
    //Define colors
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
    hexagonVertexColorBuffer.itemSize = 4;
    hexagonVertexColorBuffer.numItems = 121;

    //Define matrix with the three choosing color squares
    squares= [[square1VertexPositionBuffer,square1VertexColorBuffer],
             [square2VertexPositionBuffer,square2VertexColorBuffer],
             [square3VertexPositionBuffer,square3VertexColorBuffer]];
    //GEt the distance and the angle of that point
    initialVer= [(lastMouseX-303)*(2/607), (303-lastMouseY)*(2/607),-0.1];
    initialVer[0] = initialVer[0]+0.3;
    finalVer = [];
    disCen = Math.sqrt(Math.pow(initialVer[0],2)+Math.pow(initialVer[1],2));
    if(disCen > 0.6)
        disCen = 0.59;
    inAngle = getAngle(initialVer[0],initialVer[1]);

    var j;
    //Draw the remaining two squares
    for(i = 0; i<squares.length;i++){
        squares[noSquare+i][0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squares[noSquare+i][0]);
        inAngle = inAngle + (2*Math.PI/3);

        var tempVer = [0.0];
        tempVer[0] = (disCen * Math.cos(inAngle))-0.3;
        tempVer[1] = disCen * Math.sin(inAngle);

        finalVer.push(tempVer);
        var vertices = [
            tempVer[0]-0.02, tempVer[1]+0.02,0.0,
            tempVer[0]-0.02, tempVer[1]-0.02,0.0,
            tempVer[0]+0.02, tempVer[1]-0.02,0.0,
            tempVer[0]+0.02, tempVer[1]+0.02,0.0,
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
}

//Get the angle from a point
function getAngle(x,y){
    if(x>0){
        if(y>=0){
            angle = Math.atan(y/x);
        }
        else{
            angle = -Math.atan(-y/x);
        }
    }
    else if(x<0){
        if(y>0){
            angle = Math.PI -Math.atan(y/-x);
        }
        else if(y<0){
            angle = Math.PI +Math.atan(-y/-x);
        }
        else{
            angle = Math.PI;
        }
    }
    else{
        if(y>0){
            angle = Math.PI/2;
        }
        else if(y<0){
            angle = 3*Math.PI/2;
        }
        else{
            angle = 0;
        }
    }
    return angle;
}

//Draw all shapes
function drawSceneGeo() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0, 0.0, 0]);

    //Draw choosing color squares
    for(i=0; i<squares.length;i++){
        gl.bindBuffer(gl.ARRAY_BUFFER, squares[i][0]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squares[i][0].itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, squares[i][1]);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squares[i][1].itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_LOOP, 0, squares[i][0].numItems);
    }

    //Draw color wheel
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexPositionBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, hexagonVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, hexagonVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLE_STRIP, indices.length,gl.UNSIGNED_SHORT,0);

    //Add palette squares
    addColSqGeo();
    //Draw palette squares
    for(i=0; i<colSq.length;i++){
        gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][0]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, colSq[i][0].itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][1]);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colSq[i][1].itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, colSq[i][0].numItems);
    }


}

function addColSqGeo(){
    //Get property for reading pixels
    var pixels = new Uint8Array(gl.viewportWidth*gl.viewportHeight*4);
    gl.readPixels(0,0,gl.viewportWidth,gl.viewportHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);

    //Matrix with square's buffers
    colSq= [[colSq1VertexPositionBuffer,colSq1VertexColorBuffer],
            [colSq2VertexPositionBuffer,colSq2VertexColorBuffer],
            [colSq3VertexPositionBuffer,colSq3VertexColorBuffer]];
    var sqVertices= [
            0.4,0.7,-0.0,
            0.8,0.7,-0.0,
            0.8,0.3,-0.0,
            0.4,0.3,-0.0];
    var dif = 0;
    //Add three squares
    for(i = 0; i<colSq.length;i++){
        //Define position
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

        //Read color from centre of choosing color squares
        var x = Math.round((finalVer[2-i][0]+1)*(600/2));
        var y = Math.round((finalVer[2-i][1]+1)*(600/2));
        var index =4*(x+y*gl.viewportWidth);
        var pixelR = pixels[index]/255;
        var pixelG = pixels[index+1]/255;
        var pixelB = pixels[index+2]/255;
        var pixelA = pixels[index+3]/255;

        colSq[i][1] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colSq[i][1]);
        var colors = [
            pixelR, pixelG, pixelB, pixelA,
            pixelR, pixelG, pixelB, pixelA,
            pixelR,pixelG, pixelB, pixelA,
            pixelR, pixelG, pixelB, pixelA,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colSq[i][1].itemSize = 4;
        colSq[i][1].numItems = 4;
    }
}

