class Shape
{
    static Verify(data, def)
    {
        if(!data) 
        {
            console.log('Default')
            console.log(def);
            return def;
        }
        let keys = Object.keys(def);
        for(let i = 0; i < keys.length; i++)
        {
            data[keys[i]] = data[keys[i]] || def[keys[i]];
        }
        return data
    }

    static Add(v1, v2)
    {
        return [
            v1[0] + v2[0],
            v1[1] + v2[1],
            v1[2] + v2[2]
        ]
    }

    constructor(center, presetName, data)
    {
        this.center = center || [0, 0, 0];

        this.vectors = [];
        this.colors = [];
        this.textures = [];
        this.drawTypes = [];

        this.shapeFunction = this.Presets[presetName];
        if(this.shapeFunction)
            this.shapeFunction(data)
        
        this.CreateBuffers(drawing.webgl)
    }

    //Basically garbage
    AddV(index, data)
    {
        data = Shape.Verify(data, {
            pos: [0,0,0],
            color: [0,0,0,1],
            texture: [0,0],
            dt: 0,
        })

        let v = data.rotation ? 
            Vector.Rotate(data.pos, this.center, data.rotation) : 
            data.pos
        this.vectors[index] = this.Add(this.vectors[index], v)
        this.colors[index] = this.Add(this.colors[index], data.color)
        this.textures[index] = this.Add(this.textures[index], data.texture)
        this.drawTypes[index] = data.dt

        return this
    }

    Add(array, value)
    {
        return array ? array.concat(value) : value
    }

    Presets = {
        Square(data)
        {
            data = Shape.Verify(data, {
                height:1,
                width:1,
                index:0,
            });

            let x = this.center[0]
            let y = this.center[1]
            let z = this.center[2]

            let w = data.width;
            let h = data.height

            this.AddV(data.index, { pos:[x + w, y + h, z], 
                rotation: data.rotations });    //++
            this.AddV(data.index, { pos:[x - w, y + h, z],
                rotation: data.rotations });    //-+
            this.AddV(data.index, { pos: [x- w, y-h, z],
                rotation: data.rotations});       //--
            this.AddV(data.index, { pos: [x+w, y-h, z],
                rotation: data.rotations});        //+-
            this.AddV(data.index, { pos:[x+w, y+h, z],
                rotation: data.rotations});        //++*/
        },

        Cube(data)
        {
            Shape.Verify(data, { height: 1, width: 1, depth: 1, rotations: [0,0,0] })

            let zFace = { height: data.height, width: data.width, rotations: data.rotations };
            let faces = 
            [ 
                new Shape(Shape.Add(this.center, [0,0, data.depth / 2]), 'Square', zFace),
                //new Shape(Shape.Add(this.center, [0,0, -data.depth / 2]), 'Square', zFace)
            ];

            this.Union(faces);
        }
    }

    //Object functions
    CreateBuffers(webgl)
    {
        let buffers = 
        {
            vertex: [],
            color: [],
        }
        
        for(let i = 0; i < this.vectors.length; i++)
        {
            buffers.vertex[i] = webgl.createBuffer()
            webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.vertex[i]);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(this.vectors[i]), 
                webgl.STATIC_DRAW);
            buffers.vertex[i].typeDessin = this.drawTypes[i]
            
            buffers.color[i] = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.color[i]);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(this.colors[i]), 
                webgl.STATIC_DRAW);

            if(this.texture)
            {
                buffers.texture[i] = webgl.createBuffer();
                webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.texture[i]);
                webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(this.textures[i]), 
                    webgl.STATIC_DRAW);
                buffers.texture[i].intNoTexture = 1; 
                buffers.texture[i].pcCouleurTexel = 1.0;
            }

            if(this.mesh)
            {
                buffers.mesh[i] = webgl.createBuffer()
                webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, buffers.mesh[i]);
                webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(
                    this.meshes[i]), webgl.STATIC_DRAW);
                buffers.mesh[i].intNbTriangles = meshes[i].length;
                buffers.mesh[i].intNbDroites = 0;
            }
        }
        return (this.buffers = buffers);
    }

    Rotate(xAngle, yAngle, zAngle)
    {
        vectors.forEach(v => { Vector.Rotate(v, center, [xAngle, yAngle, zAngle]);});
    }

    Union(shape)
    {
        let i = this.vectors.length;
        if(shape instanceof Array)
        {
            shape.forEach(e => {
                this.Union2(i, e);
                i++;
            });
        }
        else this.Union2(i, shape);
    }

    Union2(i, s)
    {
        this.vectors[i] = s.vectors[i]
        this.colors[i] = s.colors[i]
        this.textures[i] = s.textures[i]
        this.drawTypes[i] = s.drawTypes[i]

        for(let i = 0; i < 3; i++)
             this.center[i] += (s.center[i] - this.center[i])/2
        
    }
}