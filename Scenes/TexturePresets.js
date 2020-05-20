function TexturePresets() 
{
	Component.apply(this, []);
	this.textures = {}
}
TexturePresets.prototype = Object.create(Component.prototype);
TexturePresets.prototype.constructor = TexturePresets;
var proto = TexturePresets.prototype;

proto.add = function(name, content)
{
	this.textures[name] = content;
}

proto.getShader = function(color, name)
{
	if(this.textures[name]) 
	{
		try{
			return new TextureShader(this.gl, new Texture(this.gl, this.textures[name]));
		}catch(e){
			console.log(e)
		}
	}

	return new ColorShader(this.gl, vec4.fromValues(color[0], color[1], color[2], color[3]));
}

var texturePresets = new TexturePresets();