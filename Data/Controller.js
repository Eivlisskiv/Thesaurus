class Controller
{
    controls =
    {
        forward: 87,
        backwards: 83,
        left: 65,
        right: 68,
    }

    constructor()
    {

    }

    KeyChange(keycode, t)
    {
        switch(keycode)
        {
            case this.controls.forward:
            {
                console.log('W')
            }break;
            case this.controls.backwards:
            {
                console.log('S')
            }break;
            case this.controls.left:
            {
                console.log('A')
            }break;
            case this.controls.right:
            {
                console.log('D')
            }break;
        }
    }
}