// Vertex shader program
var vsSourceTex =
  "attribute vec4 aVertexPosition;\n" +
  "attribute vec3 aVertexNormal;\n" +
  "attribute vec2 aTextureCoord;\n" +
  "uniform mat4 uNormalMatrix;\n" +
  "uniform mat4 uViewMatrix;\n" +
  "uniform mat4 uModelMatrix;\n" +
  "uniform mat4 uProjectionMatrix;\n" +
  "varying highp vec2 vTextureCoord;\n" +
  "varying highp vec3 vLighting;\n" +
  "void main(void) {\n" +
  "  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;\n" +
  "  vTextureCoord = aTextureCoord;\n" +
  "  highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);\n" +
  "  highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);\n" +
  "  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));\n" +
  "  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n" +
  "  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n" +
  "  vLighting = ambientLight + (directionalLightColor * directional);\n" +
  "}";

// Fragment shader program
var fsSourceTex =
  "varying highp vec2 vTextureCoord;\n" +
  "varying highp vec3 vLighting;\n" +
  "uniform sampler2D uSampler;\n" +
  "void main(void) {\n" +
  "  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);\n" +
  "  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n" +
  "}";

function TextureShader(gl, texture)
{
  Shader.apply(this, [gl, vsSourceTex, fsSourceTex]);

  this.texture = texture;
  this.vertexPosition = this.getAttribLocation("aVertexPosition");
  this.vertexNormal = this.getAttribLocation("aVertexNormal");
  this.textureCoord = this.getAttribLocation("aTextureCoord");
  this.projectionMatrix = this.getUniformLocation("uProjectionMatrix");
  this.viewMatrix = this.getUniformLocation("uViewMatrix");
  this.modelMatrix = this.getUniformLocation("uModelMatrix");
  this.normalMatrix = this.getUniformLocation("uNormalMatrix");
  this.uSampler = this.getUniformLocation("uSampler");
}
TextureShader.prototype = Object.create(Shader.prototype);
TextureShader.prototype.constructor = TextureShader;
var proto = TextureShader.prototype;

proto.use = function() 
{
  Shader.prototype.use.call(this); // Tell WebGL we want to affect texture unit 0

  this.gl.activeTexture(this.gl.TEXTURE0); // Bind the texture to texture unit 0
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture); // Tell the shader we bound the texture to texture unit 0
  this.gl.uniform1i(this.uSampler, 0);
};

proto.setPositionBuffer = function(positionBuffer) 
{
  var numComponents = 3;
  var type = this.gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  this.gl.vertexAttribPointer(this.vertexPosition, numComponents, type, normalize, stride, offset);
  this.gl.enableVertexAttribArray(this.vertexPosition);
};

proto.setTextureCoordBuffer = function(textureCoordBuffer) 
{
  var numComponents = 2;
  var type = this.gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
  this.gl.vertexAttribPointer(this.textureCoord, numComponents, type, normalize, stride, offset);
  this.gl.enableVertexAttribArray(this.textureCoord);
};

proto.setNormalBuffer = function(normalBuffer) 
{
  var numComponents = 3;
  var type = this.gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
  this.gl.vertexAttribPointer(this.vertexNormal, numComponents, type, normalize, stride, offset);
  this.gl.enableVertexAttribArray(this.vertexNormal);
};

proto.setProjectionMatrix = function(projectionMatrix) 
{
  this.gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
};

proto.setViewMatrix = function(viewMatrix) 
{
  this.gl.uniformMatrix4fv(this.viewMatrix, false, viewMatrix);
};

proto.setModelMatrix = function(modelMatrix) 
{
  this.gl.uniformMatrix4fv(this.modelMatrix, false, modelMatrix);
};

proto.setNormalMatrix = function(normalMatrix) 
{
  this.gl.uniformMatrix4fv(this.normalMatrix, false, normalMatrix);
};
