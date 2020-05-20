function Cube(gl, shader, size) 
{
    Mesh.apply(this, [gl, shader]);

    size = size || 1.0;
    
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    
    var s = size; 
    
    var positions = [// Front face
    -s, -s, s, s, -s, s, s, s, s, -s, s, s, // Back face
    -s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s, // Top face
    -s, s, -s, -s, s, s, s, s, s, s, s, -s, // Bottom face
    -s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s, // Right face
    s, -s, -s, s, s, -s, s, s, s, s, -s, s, // Left face
    -s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s];
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW); // Set up the normals for the vertices, so that we can compute lighting.
    
    
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    var vertexNormals = [// Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0];
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexNormals), this.gl.STATIC_DRAW); 

    this.textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    var textureCoordinates = [// Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW);

    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); 
    var indices = [0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23 // left
    ]; // Now send the element array to GL

    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
}

Cube.prototype = Object.create(Mesh.prototype);
Cube.prototype.constructor = Cube;
var proto = Cube.prototype;

proto.finishDraw = function(projectionMatrix, viewMatrix, modelMatrix, normalMatrix)
{
    this.shader.setPositionBuffer(this.positionBuffer);
    this.shader.setTextureCoordBuffer(this.textureCoordBuffer);
    this.shader.setNormalBuffer(this.normalBuffer);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.shader.use();
    this.shader.setProjectionMatrix(projectionMatrix);
    this.shader.setViewMatrix(viewMatrix);
    this.shader.setModelMatrix(modelMatrix);
    this.shader.setNormalMatrix(normalMatrix);
    var vertexCount = 36;
    var type = this.gl.UNSIGNED_SHORT;
    var offset = 0;
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
};