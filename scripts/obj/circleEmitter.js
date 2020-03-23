class CircleEmitter extends WorldObj {

    constructor (x, y, physWorld, Obj) {
	super()
	this.rad = 40;

	let bdy = M.Bodies.circle(x, y, this.rad);
	bdy.frictionAir = 0.5;
	this.addToWorld(bdy, physWorld, Obj);
    }

    draw() {
	let pos = this.getPosition()
	push()
	ellipseMode(RADIUS)
	translate(pos.x, pos.y);
	rotate(pos.a);
	circle(0, 0, this.rad);
	pop()
    }

}
