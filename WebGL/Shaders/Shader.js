function Shader(gl, vsSource, fsSource) 
{
  this.gl = gl;
  this.program = this.initProgram(vsSource, fsSource);
}
var proto = Shader.prototype;

proto.initProgram = function initProgram(vsSource, fsSource) 
{
  var vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
  var fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource); // Create the shader program

  var program = this.gl.createProgram();
  this.gl.attachShader(program, vertexShader);
  this.gl.attachShader(program, fragmentShader);
  this.gl.linkProgram(program); // If creating the shader program failed, log an error

  if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) 
  {
    console.error("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(program));
    return null;
  }

  return program;
};

proto.loadShader = function(type, source) 
{
  var shader = this.gl.createShader(type); // Send the source to the shader object
  this.gl.shaderSource(shader, source); // Compile the shader program
  this.gl.compileShader(shader); // See if it compiles successfully

  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) 
  {
    console.error("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));

    this.gl.deleteShader(shader);
    return null;
  }
  return shader;
};

proto.getAttribLocation = function(name) 
{
  return this.gl.getAttribLocation(this.program, name);
};

proto.getUniformLocation = function(name) 
{
  return this.gl.getUniformLocation(this.program, name);
};

proto.use = function() 
{
  this.gl.useProgram(this.program);
};

proto.setProjectionMatrix = function (projectionMatrix) {};

proto.setViewMatrix = function (viewMatrix) {};
proto.setModelMatrix = function (modelMatrix) {};
proto.setNormalMatrix = function (normalMatrix) {};
proto.setPositionBuffer = function (positionBuffer) {};
proto.setTextureCoordBuffer = function (textureCoordBuffer) {};
proto.setNormalBuffer = function (normalBuffer) {};
