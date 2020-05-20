var gl;

var temps = 60;
var pausedTime = 0;
var paused = true;
var end = false;
var view2 = false;

var diggers = 4;
var score = 300;
var currentLevel = 1;
var ui = {}
var tasks = []

var map;

function run() {
  var canvas = document.getElementById("glCanvas");
  canvas.width = 1200;
  canvas.height = 800;
  inputManager.canvas = canvas;
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  
  if (!gl) {
    console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  texturePresets.gl = gl;

  var scene = new Scene(gl);
  map = new Map(gl, scene, texturePresets);

  var camera = new Camera();
  var cameraEntity = new Entity();
  cameraEntity.position = vec3.fromValues(0, 0, 0);

  quat.fromEuler(cameraEntity.rotation, -15, 0, 0);

  var controller = new CameraController(map);
  map.camControl = controller;

  cameraEntity.attachComponent(camera);
  cameraEntity.attachComponent(controller);
  controller.reset(map.camSpawn)
  scene.setCamera(camera);

  var then = 0;
  var dthen = new Date();
  function render(now) 
  {
    now *= 0.001;
    
    passTime((new Date() - dthen)/1000)

    dthen = new Date();

    var deltaTime = now - then;
    then = now;
    scene.update(deltaTime);
    scene.draw();
    if(!end)
      requestAnimationFrame(render);
  }

    requestAnimationFrame(render);
    inputManager.map = map;
    paused = false;
    soundHandler.play('start')
}

function wait(seconds, func)
{
  tasks.push({timeLeft:seconds, function:func})
}

function passTime(seconds)
{
  if(!paused)
  {
    if(view2)
    {
      pausedTime += seconds;
      if(pausedTime > 1)
      {
        pausedTime -= 1;
        updateScore(-10)
        if(score < 10)
          map.mapView(false);
      }
    }
    else if (Math.ceil(temps + seconds) != temps)
      updateTime(seconds)
  }

  let i = 0;
  while(i < tasks.length)
  {
    var task = tasks[i]
    task.timeLeft -= seconds;
    if(task.timeLeft <= 0)
    {
      task.function();
      tasks.splice(i, 1);
    }
    else 
      i++;
  }
}

function updateTime(elapsed)
{
  temps -= elapsed;

  if(temps < 0) map.fail();

  getUI('time').innerHTML = 'Temps: 00:' + Math.ceil(temps);
}

function updateLevel(level)
{
  currentLevel = level;
  getUI('level').innerHTML = 'Niveau ' + level;
}

function updateDiggers(d)
{
  diggers += d;
  getUI('digger').innerHTML = 'Creuseurs: ' + diggers;
}

function updateScore(add)
{
  score += add;
  getUI('score').innerHTML = 'Score: ' + score;
}

function getUI(n)
{
  return ui[n] || (ui[n] = document.getElementById(n));
}

function fromrgb(r, g, b)
{
  return [r/255, g/255, b/255, 1 ];
}

function vts(a)
{
  return '[' + a[0] + ',' + a[1] + ',' + a[2] + ']'
}

Math.fc = function(x)
{
  return x > 0 ? Math.ceil(x) : Math.floor(x)
}

run();
