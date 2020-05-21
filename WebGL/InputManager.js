function InputManager() {
  this.canvas = null;
  this.keysPressed = {};
  var caller = this;

  document.addEventListener("keydown",
    function (evt) 
    {
      return caller.keyDownHandler(evt);
    },
    false
  );
  document.addEventListener("keyup",
    function (evt) 
    {
      return caller.keyUpHandler(evt);
    },
    false
  );
}

InputManager.prototype.keyDownHandler = function(event) 
{
  if(!this.firstInput)
  {
    soundHandler.play('start')
    this.firstInput = true;
    paused = false;
  }
  if(event.keyCode == 32 && this.map)
    this.map.dig()
  var action = this.getAction(event.keyCode, true);
  if(action)
    this.keysPressed[action] = true;
  else
  {
    switch(event.keyCode)
    {
      case 33: return this.map.mapView(true); //map
      case 34: return this.map.mapView(false); //close map
    }
  }
};

InputManager.prototype.keyUpHandler = function(event) 
{
  var action = this.getAction(event.keyCode, false);
  if (action && action in this.keysPressed) 
  {
    delete this.keysPressed[action];
  }
};

InputManager.prototype.isKeyDown = function(action) 
{
  return action in this.keysPressed;
};

InputManager.prototype.getAction = function(code, press)
{
  if(!this.map) return false;
  switch(code)
  {
      case 87:
      case 38:
        return 'forward';
      case 83:
      case 40:
        return 'backwards';
      case 68:
      case 39:
        return 'right';
      case 65:
      case 37:
        return 'left';

      case 16: return press ? this.map.showTreasure('s') : 's';
      case 17: return press ? this.map.showTreasure('c') : 'c';
      case 32: return press ? this.map.showTreasure('e') : 'e';
  }
}

var inputManager = new InputManager();
