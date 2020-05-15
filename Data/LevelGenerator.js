class Level
{
    constructor(l)
    {
        this.level = 1
        this.load()
    }

    load()
    {
        this.content = new Array();
        this.Presets["Level" + this.level](this);
    }

    add(obj)
    {
        this.content[this.content.length] = obj
    }

    Presets =
    {
        Level1(level)
        {
            level.add(drawing.QuadObj([0,0,0], 1, 1, 1));
        }
    }
}