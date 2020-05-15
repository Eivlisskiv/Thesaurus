DrawingTypes = 
{
    LINE_STRIP: 0,
    LINE_LOOP: 1,
    TRIANGLE_STRIP: 2,
    TRIANGLE_FAN: 3,
    TRIANGLES: 4,
}

class Vector
{   
    static Rotate(v, origin, angles)
    {
        v = Vector.Sub(v, origin);
        v = angles[0] != 0 ? RotateX(v, angles[0]) : v;
        v = angles[1] != 0 ? RotateX(v, angles[1]) : v;
        v = angles[2] != 0 ? RotateX(v, angles[2]) : v;
       return [
            v[0] + origin[0],
            v[1] + origin[1],
            v[2] + origin[2]
        ]
    }

    static RotateX(v, a)
    {
        return [
            v[0],
            (v[1] * Math.cos(a)) - (v[2] * Math.sin(a)),
            (v[1] * Math.sin(a)) + (v[2] * Math.cos(a)),
        ]
    }

    static RotateY(v, a)
    {
        return [
            (v[0] * Math.cos(a)) + (v[2] * Math.sin(a)),
            v[1]
            -(v[0] * Math.sin(a)) + (v[2] * Math.cos(a)),
        ]
    }

    static RotateZ(v, a)
    {
        return [
            (v[0] * Math.cos(a)) - (v[1] * Math.sin(a)),
            (v[0] * Math.sin(a)) + (v[1] * Math.cos(a)),
            v[2]
        ]
    }

    static Sub(v1, v2)
    {
        return [
            v1[0] - v2[0],
            v1[1] - v2[1],
            v1[2] - v2[2]
        ]
    }
}

