// Vertex shader program
var vsSourceColor =
  "attribute vec4 aVertexPosition;\n" +
  "attribute vec3 aVertexNormal;\n" +
  "attribute vec2 aTextureCoord;\n" +
  "uniform mat4 uNormalMatrix;\n" +
  "uniform mat4 uViewMatrix;\n" +
  "uniform mat4 uModelMatrix;\n" +
  "uniform mat4 uProjectionMatrix;\n" +
  "uniform vec4 uColor;\n" +
  "varying highp vec4 vColor;\n" +
  "varying highp vec3 vLighting;\n" +
  "void main(void) {\n" +
  "  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;\n" +
  "  vColor = uColor;\n" +
  "  // Apply lighting effect\n" +
  "  highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n" +
  "  highp vec3 directionalLightColor = vec3(1, 1, 1);\n" +
  "  highp vec3 directionalVector = normalize(vec3(0.85, 0.2, 0.75));\n" +
  "  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n" +
  "  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n" +
  "  vLighting = ambientLight + (directionalLightColor * directional);\n" +
  "}";

// Fragment shader program
var fsSourceColor = "varying highp vec4 vColor;\n" + "varying highp vec3 vLighting;\n" + "void main(void) {\n" + "   gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);\n" + "}";

function ColorShader(gl, color) {
  Shader.apply(this, [gl, vsSourceColor, fsSourceColor]);

  this.color = color; // Get all locations for later use

  this.vertexPosition = this.getAttribLocation("aVertexPosition");
  this.vertexNormal = this.getAttribLocation("aVertexNormal");
  this.colorPosition = this.getUniformLocation("uColor");
  this.projectionMatrix = this.getUniformLocation("uProjectionMatrix");
  this.viewMatrix = this.getUniformLocation("uViewMatrix");
  this.modelMatrix = this.getUniformLocation("uModelMatrix");
  this.normalMatrix = this.getUniformLocation("uNormalMatrix");
}

ColorShader.prototype = Object.create(Shader.prototype);
ColorShader.prototype.constructor = ColorShader;
var proto = ColorShader.prototype;

proto.use = function () {
  Shader.prototype.use.call(this);
  this.gl.uniform4fv(this.colorPosition, this.color);
};

proto.setPositionBuffer = function (positionBuffer) {
  var numComponents = 3;
  var type = this.gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

  this.gl.vertexAttribPointer(this.vertexPosition, numComponents, type, normalize, stride, offset);

  this.gl.enableVertexAttribArray(this.vertexPosition);
};

proto.setNormalBuffer = function (normalBuffer) {
  var numComponents = 3;
  var type = this.gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);

  this.gl.vertexAttribPointer(this.vertexNormal, numComponents, type, normalize, stride, offset);

  this.gl.enableVertexAttribArray(this.vertexNormal);
};

proto.setProjectionMatrix = function (projectionMatrix) {
  this.gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
};

proto.setViewMatrix = function (viewMatrix) {
  this.gl.uniformMatrix4fv(this.viewMatrix, false, viewMatrix);
};

proto.setModelMatrix = function (modelMatrix) {
  this.gl.uniformMatrix4fv(this.modelMatrix, false, modelMatrix);
};

proto.setNormalMatrix = function (normalMatrix) {
  this.gl.uniformMatrix4fv(this.normalMatrix, false, normalMatrix);
};
