function CameraController(map) 
{
  Component.apply(this, [true]);

  this.speed = 5;
  this.rotSpeed = 80;
  this.mousePrecision = 0.05;
  this.xRotation = 0;
  this.yRotation = 0;
  var caller = this;

  this.enabled = true;

  this.camInfo = document.getElementById('camPos')

  this.map = map;
}
CameraController.prototype = Object.create(Component.prototype);
CameraController.prototype.constructor = CameraController;
var proto = CameraController.prototype;

proto.reset = function(pos) 
{
  if (this.entity === null) return;

  this.entity.position = pos || vec3.fromValues(15,0,16);
  this.xRotation = 0;
  this.yRotation = 0;
  this.rotate(0,0);
};

proto.rotate = function(x, y) 
{
  this.xRotation -= this.mousePrecision * y;
  this.yRotation -= this.mousePrecision * x;

  quat.fromEuler(this.entity.rotation, this.xRotation, this.yRotation, 0.0);
};

proto.update = function(deltaTime) 
{
  if(!this.enabled) return;

  if (inputManager.isKeyDown("forward")) 
  { // Move forward
    var dir = vec3.fromValues(0, 0, -this.speed * deltaTime);
    vec3.transformQuat(dir, dir, this.entity.rotation);
    dir[1] = 0
    dir = this.map ? this.map.accessible(this.entity, dir) : dir

    vec3.add(this.entity.position, this.entity.position, dir);
  }
  if (inputManager.isKeyDown("backwards")) 
  {  // Move backwards
    var dir = vec3.fromValues(0, 0, this.speed * deltaTime);
    vec3.transformQuat(dir, dir, this.entity.rotation);
    dir[1] = 0
    dir = this.map ? this.map.accessible(this.entity, dir) : dir

    vec3.add(this.entity.position, this.entity.position, dir);
  }
  if (inputManager.isKeyDown("left")) 
  { // Move left
    this.rotate(-this.rotSpeed, 0);
  }
  if (inputManager.isKeyDown("right")) 
  { // Move right
    this.rotate(this.rotSpeed, 0);
  }
  var x = Math.floor(this.entity.position[0]);
  var y = Math.floor(this.entity.position[2])
  this.camInfo.innerHTML = 'Cam: [' + x + ',' + y + '] ' + 
   (this.map ? this.map.grid[x + (y * 31)] : '');
};
