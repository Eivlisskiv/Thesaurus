function Mesh(gl, shader) {
  Component.apply(this, arguments);

  this.gl = gl;
  this.shader = shader;
}
Mesh.prototype = Object.create(Component.prototype);
Mesh.prototype.constructor = Mesh;
var proto = Mesh.prototype;

proto.draw = function(projectionMatrix, viewMatrix)
{
  if (this.entity === null)  return;
  
  var modelMatrix = mat4.create();

  mat4.fromRotationTranslationScale(modelMatrix, this.entity.rotation, this.entity.position, this.entity.scale);
  var normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  this.finishDraw(projectionMatrix, viewMatrix, modelMatrix, normalMatrix);
};

proto.finishDraw = function (projectionMatrix, viewMatrix, modelMatrix, normalMatrix) {};
