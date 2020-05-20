function isPowerOf2(value) 
{
  return (value & (value - 1)) === 0;
}

function Texture(gl, url) 
{
  this.gl = gl;
  this.load(url);
}
var proto = Texture.prototype;

proto.load = function(url) 
{
  if (this.texture !== undefined) { this.gl.deleteTexture(this.texture); }

  var texture = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  var level = 0;
  var internalFormat = this.gl.RGBA;
  var width = 1;
  var height = 1;
  var border = 0;
  var srcFormat = this.gl.RGBA;
  var srcType = this.gl.UNSIGNED_BYTE;
  var pixel = new Uint8Array([0, 0, 255, 255]);

  this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
     width, height, border, srcFormat, srcType, pixel);
  var image = new Image();
  var gl = this.gl;

  image.onload = function() 
  {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) 
    {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    else 
    {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };

  image.src = url;
  this.texture = texture;
};
