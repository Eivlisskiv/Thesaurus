function Entity() 
{
  this.position = vec3.fromValues(0, 0, 0);
  this.scale = vec3.fromValues(1, 1, 1);
  this.rotation = quat.fromValues(0, 0, 0, 1);
  this.components = [];
  this._canUpdate = false;
  this.visible = true;
}
var proto = Entity.prototype;

proto.canUpdate = function() 
{
  return this._canUpdate;
};

proto.updateCanUpdateFlag = function() 
{
  this._canUpdate = this.components.some(function (c) 
  {
    return c.canUpdate;
  });
};

proto.attachComponent = function(component) 
{
  if (component in this.components) return;

  if (component.entity !== null) 
    component.entity.removeComponent(component);

  component.entity = this;
  this.components.push(component);
  this.updateCanUpdateFlag();
};

proto.removeComponent = function(component) 
{
  for (var i = 0; i < this.components.length; ++i) {
    if (this.components[i] === component)
    {
      this.components.splice(i, 1);
      this.updateCanUpdateFlag();
      return;
    }
  }
};

proto.update = function(deltaTime) 
{
  this.components.forEach(function(c) 
  {
    if(c.canUpdate) c.update(deltaTime);
  });
};

proto.draw = function(projectionMatrix, viewMatrix) 
{
  if(!this.visible) return;
  this.components.forEach(function(c) 
  {
    if(c instanceof Mesh) c.draw(projectionMatrix, viewMatrix);
  });
};
