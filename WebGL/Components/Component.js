function Component(canUpdate) 
{
  this.entity = null;
  this.canUpdate = canUpdate || false;
}
var proto = Component.prototype;

proto.update = function(deltaTime) {};
