function Scene(gl)
{
  this.gl = gl;
  this.camera = null;
  this.clearColor = vec4.fromValues(0.1, 0.1, 0.1, 1.0);
  this.clearDepth = 1.0;
  this.entities = [];
}
var proto = Scene.prototype;

proto.addEntity = function(entity) 
{
  if (entity in this.entities) return;

  this.entities.push(entity);
};

proto.removeEntity = function(entity) 
{
  for (var i = 0; i < this.entities.length; ++i) 
  {
    if (this.entities[i] === entity) 
    {
      this.entities.splice(i, 1);
      return;
    }
  }
};

proto.clear = function()
{
  this.entities = []
}

proto.update = function(deltaTime) 
{
  this.entities.forEach(function (e) 
  {
    if (e.canUpdate) 
      e.update(deltaTime);
  });
};

proto.draw = function() 
{
  var red = this.clearColor[0],
    green = this.clearColor[1],
    blue = this.clearColor[2],
    alpha = this.clearColor[3];

  this.gl.clearColor(red, green, blue, alpha);
  this.gl.clearDepth(1.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
  var projectionMatrix = this.camera.calculateProjectionMatrix(aspect);
  var viewMatrix = this.camera.calculateViewMatrix();

  this.entities.forEach(function(e) 
  {
    return e.draw(projectionMatrix, viewMatrix);
  });
};

proto.setCamera = function(value) 
{
  this.camera = value;
  if (!(value.entity in this.entities)) 
  {
    this.entities.push(value.entity);
  }
};
