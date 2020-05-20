function Camera() 
{
  Component.apply(this, []);

  this.fieldOfView = (60 * Math.PI) / 180;
  this.zNear = 0.1;
  this.zFar = 300;
}
Camera.prototype = Object.create(Component.prototype);
Camera.prototype.constructor = Camera;
var proto = Camera.prototype;

proto.calculateProjectionMatrix = function(aspect)
{
  var projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, this.fieldOfView, aspect, this.zNear, this.zFar);
  return projectionMatrix;
};

proto.calculateViewMatrix = function() 
{
  var viewMatrix = mat4.create();
  mat4.fromRotationTranslationScale(viewMatrix, this.entity.rotation, this.entity.position, this.entity.scale);
  mat4.invert(viewMatrix, viewMatrix);
  return viewMatrix;
};
