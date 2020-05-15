
class Drawing
{
    constructor(canvas, Config)
    {
        this.canvas = canvas;

        let s = Config.cellSize * Config.cellCount;

        canvas.width = s;
        canvas.height = s;

        this.webgl = initWebGL(this.canvas);

        this.DrawTypes =
        [
            this.webgl.POINTS,
            this.webgl.LINE_STRIP,
            this.webgl.LINE_LOOP,
            this.webgl.LINES,
            this.webgl.TRIANGLE_STRIP,
            this.webgl.TRIANGLE_FAN,
            this.webgl.TRIANGLES,
        ]

        this.shaders = initShaders(this.webgl);
    }

    Clear()
    {
        this.webgl.clearColor(.5, .5, .5, 1.0);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
    }

    QuadObj(center, height, width, depth)
    {
        return new Shape(center, 'Cube', {
            height: height, 
            width:  width,
            depth: depth,
        })
        
    }

    ObjectOutline(obj)
    {

    }

    SetBuffers(vertexes)
    {
        let buffers = new Array();
        for(let i = 0; i < vertexes.length; i++)
        {
            buffers[i] = vertexes[i].Buffer(this.webgl);
        }
        return buffers;
    }

    Draw()
    {
        let webgl = this.webgl;

        webgl.viewport(0, 0, webgl.drawingBufferWidth, webgl.drawingBufferHeight);

        const matProjection = mat4.create();
    
        const fltRapportCanevas = webgl.drawingBufferWidth / webgl.drawingBufferHeight;
        mat4.perspective(45, fltRapportCanevas, 0.01, 100, matProjection);          
		// Relier la matrice aux shaders
        webgl.uniformMatrix4fv(this.shaders.matProjection, false, matProjection);

        const matModeleVue = mat4.create();
        mat4.identity(matModeleVue);
        mat4.translate(matModeleVue, [0,-5,0]);
        mat4.lookAt([0,-5,0], [0,0,0], [0,1,0], matModeleVue);

        for(let i=0; i < this.scene.length; i++)
        {
            let obj = this.scene[i]
            let buffer = this.scene[i].buffers//.CreateBuffers(webgl);
            //console.log(obj);

            for(let j = 0; j < buffer.vertex.length && (!obj.mesh || j < 1); j++)
            {

                const intNbVertex = this.VertexBuffer(
                    obj.mesh ? buffer.vertex :
                    buffer.vertex[j]);
                this.ColorBuffer(
                    obj.mesh ? buffer.color :
                    buffer.color[j]);

                // Dessiner
                if(obj.mesh)
                    TextureBuffer(buffer.texture)
                else
                    webgl.drawArrays(this.DrawTypes[1], 0, intNbVertex);
            }
        }
    }

    VertexBuffer(vertex)
    {
        console.log(vertex)
        let webgl = this.webgl;
        // Relier les vertex aux shaders
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertex);
        webgl.vertexAttribPointer(this.shaders.posVertex, 3, webgl.FLOAT, false, 0, 0);
        return (webgl.getBufferParameter(webgl.ARRAY_BUFFER,
             webgl.BUFFER_SIZE) / 4) / 3;
    }

    ColorBuffer(color)
    {
         // Relier les couleurs aux shaders
         this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, color);
         this.webgl.vertexAttribPointer(this.shaders.couleurVertex, 4,
            this.webgl.FLOAT, false, 0, 0);
    }

    MeshBuffer(textures)
    {
        let webgl = this.webgl;
        webgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, textures);
        
        webgl.drawElements(webgl.TRIANGLES, textures.intNbTriangles * 3,
            webgl.UNSIGNED_SHORT, 0);

        webgl.drawElements(webgl.LINES, textures.intNbDroites * 2,
            webgl.UNSIGNED_SHORT, textures.intNbTriangles * 2 * 3);
    }

}