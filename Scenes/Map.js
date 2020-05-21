function Map(gl, scene, textures)
{
	Component.apply(this, [])

	this.size = 1

	this.gl = gl;
	this.scene = scene
	this.texturePresets = textures
	this.cubeType = [
		{ 
			//Black, empties: 0
			floor: [0.5,0.5,0,1],
		},
		{ 
			//Green, outer: 1
			wall: [0,1,0,0.5],
		},
		{ 
			//Red maze: 2
			wall: [1,0,0,0.5],
			floor: fromrgb(255, 151, 31),
			ceilling: fromrgb(0, 102, 172),
		},
		{ 
			//Spawn: 3
			floor: fromrgb(255, 151, 31),
			ceilling: fromrgb(0, 102, 172),
		},
		{
			//treasure : 4
			treasure: [1,0,1,1],
			floor: [0.5,0.5,0,1],
		}

	]

	this.mapEntity = new Entity();

	this.loading = 0;
	this.loaded = 0;
	this.toloaded = 1;

	this.camSpawn = [15.5, 0, 15.5]

	this.initialize();
}

Map.prototype = Object.create(Component.prototype);
Map.prototype.constructor = Map;

var proto = Map.prototype;

proto.initialize = function()
{
	this.grid = level1;
	this.toloaded += level1.length

	this.walls = new Array();
	this.treasureSpawns = new Array();
	for(var j = 0; j < 31; j++)
	{
		for(var i = 0; i < 31; i++)
		{
			var index = i+(j * 31)
			var t = this.grid[index]

			var data = this.cubeType[t]
			if(t == 0)
			{
				this.treasureSpawns[this.treasureSpawns.length] = index;
			}
			if(data)
			{
				if(data.wall)
					this.createCube(i, j, data.wall, t)
				if(data.floor)
					this.createFloor(i, j, data.floor)
				if(data.treasure)
					this.createTreasure(i, j, data.treasure);
			}
			this.updateLoading(1)
		}
	}
	this.spawnTreasure()
	this.wallStatus(15, 13, false)
	this.createCeilling()
}

proto.createCube = function(x, z, color, i)
{
	var entity = new Entity();
	var height = this.size * 1
	var s = (this.size/2)
	entity.position = vec3.fromValues((x * this.size) + s, height/2, z * this.size + s);
	entity.scale = vec3.fromValues(s, height, s);

	var colorShader = new ColorShader(this.gl, vec4.fromValues(color[0],
		color[1], color[2] + x/31, color[3] + z/31));

	var mesh = new Cube(this.gl, this.texturePresets.getShader(color, i == 2 ? 'wall' : 'block'), 1);
	entity.attachComponent(mesh)

	this.scene.addEntity(entity)

	this.walls[x + (z*31)] = entity;
}

proto.createFloor = function(x, z, color)
{
	var entity = new Entity();
	var s = (this.size/2)
	entity.position = vec3.fromValues(x * this.size + s, -1, z * this.size + s);
	entity.scale = vec3.fromValues(s, 0.5, s);

	var mesh = new Cube(this.gl, this.texturePresets.getShader(color, 'floor'), 1);
	entity.attachComponent(mesh)

	this.scene.addEntity(entity)
}

proto.createCeilling = function()
{
	var entity = new Entity();
	entity.position = vec3.fromValues(16, this.size, 16);
	entity.scale = vec3.fromValues(16, 0.1, 16);

	var mesh = new Cube(this.gl, this.texturePresets.getShader([0,0,0,1], 'ceilling'), 1);
	entity.attachComponent(mesh)

	this.scene.addEntity(entity)
	this.ceilling = entity;
}

proto.spawnTreasure = function()
{
	var tr = this.treasureSpawns[Math.floor(Math.random() * this.treasureSpawns.length) + 1];
	var y = Math.floor(tr/31)
	var x = tr - (y * 31);
	
	if(this.treasure)
	{
		this.treasureSpawn = [x, y]
		this.treasure.position = vec3.fromValues(x * this.size + (this.size/2), -0.425, y * this.size + (this.size/2))
	}
	else
		this.createTreasure(x, y)
}

proto.createTreasure = function(x, z, color)
{
	this.treasureSpawn = [x, z];

	var entity = new Entity();
	var height = 0.15
	var s = (this.size/2)
	entity.position = vec3.fromValues(x * this.size + s, height/2 - 0.5, z * this.size + s);
	entity.scale = vec3.fromValues(this.size/3.5, height, height);
	entity.attachComponent(new Cube(this.gl, this.texturePresets.getShader(color, 'treasure'), 1));
	this.treasure = entity;
	this.scene.addEntity(entity)
	this.updateLoading(1)
}

proto.updateLoading = function(i)
{
	this.loading += i
	var y = Math.floor(this.loading * 100 / this.toloaded);
	if(y != this.loaded)
	{
		this.loaded = y
		var x = 'Loading: ' + y + '%';
		if(true)
		{
			console.clear();
			console.log(x)
		}
	}
}

proto.completeMap = function()
{
	this.win()
	return vec3.fromValues(0,0,0);
}

proto.gameOver = function()
{
	soundHandler.play('over')
	end = true;
	document.getElementById('game').innerHTML = 
	"<div id='end'><label>Game Over</label> </div>"
}

proto.gameFinished = function()
{
	soundHandler.play('victory')
	end = true;
	document.getElementById('game').innerHTML = 
	"<div id='end'><label>Game Won</label> </div>"
}

proto.fail = function()
{
	temps = 60
	this.camControl.enabled = false;
	soundHandler.stop('start')
	
	if(score < 200)
		return this.gameOver();

	soundHandler.play('failed')
	updateScore(-200)
	wait(4, function() { 
		map.restart(currentLevel, false)
	})
}

proto.win = function()
{
	soundHandler.stop('start')
	soundHandler.play('win')
	if(currentLevel == 10)
	{
		wait(2, function() {
			map.gameFinished()
		})
		
		return;
	}

	
	this.camControl.enabled = false;
	updateScore(10 * Math.floor(temps))
	wait(2, function() { 
		map.restart(currentLevel + 1, true)
	})
}

proto.restart = function(level, win)
{	
	this.camControl.reset(vec3.fromValues(15.5, 0, 15.5))
	//this.camControl.entity.position = vec3.fromValues(15.5, 0, 15.5);

	temps = 60;
	updateLevel(level)
	diggers = 0;
	var dCounts = [4,4,3,3,2,2,1,1,0,0]
	updateDiggers(dCounts[level - 1] || 0)
	
	this.resetMap();
	soundHandler.play('start')
	this.camControl.enabled = true
}

proto.resetMap = function()
{
	this.treasureSpawn = null;
	for(var j = 0; j < 31; j++)
	{
		for(var i = 0; i < 31; i++)
		{
			var index = i+(j * 31)
			var t = this.grid[index]

			var data = this.cubeType[t]

			if(t == 5) //is a wall
			{
				this.wallStatus(i, j, true)
			}
		}
	}
	this.spawnTreasure()
	this.wallStatus(15, 13, false)
}

proto.wallStatus = function(x, y, visible)
{
	var index = x + (y * 31);
	var type = this.grid[index];
	if( (type != 2 && type != 5) || 
		(type == 5 && !visible) ||
		(type == 2 && visible)) return;

	this.walls[index].visible = visible; 
	this.grid[index] = visible ? 2 : 5;
}

proto.getTileType = function(x, y)
{
	return this.grid[Math.floor(x) + (Math.floor(y) * 31)]
}

proto.accessible = function(cam, dir)
{	
	var offset = 0.12;

	var currentGrid = [Math.floor(cam.position[0]), Math.floor(cam.position[2])]
	var targetGrid = [Math.floor(cam.position[0] + dir[0] + (offset * Math.fc(dir[0])) ),
	 				Math.floor(cam.position[2] + dir[2] + (offset * Math.fc(dir[2])) )]

	if(currentGrid[0] == 15 && currentGrid[1] == 12)
		this.wallStatus(15, 13, true);

	if(currentGrid[0] == this.treasureSpawn[0] && currentGrid[1] == this.treasureSpawn[1])
		return this.completeMap();
	else if(currentGrid[0] == targetGrid[0] && currentGrid[1] == targetGrid[1]) 
		return dir;
	
	var targetGridType = this.grid[targetGrid[0] + (targetGrid[1] * 31)]

	if(targetGridType == 2 || targetGridType == 1) 
	{
		var x = targetGrid[0] - currentGrid[0];
		var z = targetGrid[1] - currentGrid[1];

		dir[0] = x != 0 ? 0 : dir[0];
		dir[2] = z != 0 ? 0 : dir[2];
	}
	return dir;
}

proto.dig = function()
{
	if(!this.ceilling.visible || diggers <= 0 || score < 50) return;

	var pos = this.camControl.entity.position;

	var currentGrid = [Math.floor(pos[0]), Math.floor(pos[2])]

	dir = vec3.fromValues(0, 0, -1);
	vec3.transformQuat(dir, dir, this.camControl.entity.rotation);

	var targetGrid = Math.abs(dir[0]) > Math.abs(dir[2]) ?  
					[currentGrid[0] +  Math.fc(dir[0]), currentGrid[1]] :
					[currentGrid[0], currentGrid[1] + Math.fc(dir[2])] 

	if(targetGrid[0] == 15 && targetGrid[1] == 13) return;


	if(this.grid[targetGrid[0] + (targetGrid[1] * 31)] == 2)
	{
		soundHandler.play('dig')
		this.wallStatus(targetGrid[0], targetGrid[1], false);
		updateDiggers(-1);
		updateScore(-50)
	}
}

proto.mapView = function(opened)
{
	if(this.ceilling.visible != opened || (opened && score < 10)) return;

	this.ceilling.visible = !opened;
	this.camControl.enabled = !opened;
	this.treasure.visible = !opened;
	view2 = opened;

	if(opened)
	{
		this.camData = 
		{
			pos: this.camControl.entity.position,
			rot: [this.camControl.xRotation, this.camControl.yRotation]
		}
		this.camControl.reset(vec3.fromValues(15.5, 32, 15.5));
		this.camControl.entity.rotation[0] = -Math.PI/4.48
		this.camControl.fieldOfView = (0 * Math.PI) / 180;

		this.treasure.position[1] += 1.5
		paused = true;
	}
	else
	{
		this.camControl.reset(this.camData.pos)
		var r = this.camData.rot
		this.camControl.xRotation = r[0];
		this.camControl.yRotation = r[1];
		this.camControl.rotate(0,0);
		this.camControl.fieldOfView = (60 * Math.PI) / 180;

		this.treasure.position[1] -= 1.5
		paused = false;
		pausedTime = 0;
	}
}

proto.showTreasure = function(k)
{
	if((k == 'c' || inputManager.isKeyDown('c')) 
	&& (k == 's' || inputManager.isKeyDown('s'))
	&& (k == 'e' || inputManager.isKeyDown('e')))
	{
		if(!this.ceilling.visible)
		{
			this.treasure.visible = !this.treasure.visible;
		}
	}

	return k;
}