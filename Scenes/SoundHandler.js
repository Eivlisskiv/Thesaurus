function SoundHandler()
{
    Component.apply(this, [])
    this.sounds = {};
    this.add('start');
    this.add('failed');
    this.add('dig');
    this.add('win');
    this.add('victory');
    this.add('over');
}

SoundHandler.prototype = Object.create(Component.prototype);
SoundHandler.prototype.constructor = SoundHandler;
var proto = SoundHandler.prototype;

proto.add = function(id)
{
    this.sounds[id] = { }
    this.sounds[id] = new Audio('./Sounds/' + id + '.mp3')
}

proto.play = function(id)
{
    if(this.sounds[id])
        this.sounds[id].play()
    else console.log('Sound ' + id + ' does not exist')
}

proto.stop = function(id)
{
    if(this.sounds[id])
    {
        this.sounds[id].pause();
        this.sounds[id].currentTime = 0;
    }
}

var soundHandler = new SoundHandler()