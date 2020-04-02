class CircleEmitter extends WorldObj {

    constructor (x, y, physWorld, Obj) {
	super()
	this.tickable = true;
	this.rad = 40;
	this.domElement.className = "game-object circle-emitter"
	this.domElement.style.width = this.rad*2 + "px";
	this.domElement.style.height = this.rad*2 + "px";
	this.littleCircle = document.createElement("DIV");
	this.littleCircle.className = "little-circle";
	this.domElement.appendChild(this.littleCircle)

	let bdy = M.Bodies.circle(x, y, this.rad);
	bdy.frictionAir = 0.5;
	this.addToWorld(bdy, physWorld, Obj);


    }

    onTick() {
	//called when tempo ticks
	let rect = this.littleCircle.getBoundingClientRect();
	let lilCirclePos = createVector( rect.x + rect.width/2,
					 rect.y + rect.height/2);
	let pos = createVector( this.body.position.x,
				this.body.position.y )
	let dir = lilCirclePos.sub(pos)
	let projPos =  pos.add(dir.mult(1.7));
	let newProj = new CircleProjectile(projPos.x, projPos.y, World, Obj);
	M.Body.setVelocity(newProj.body, dir.mult(constants.launchVelocity));
	//M.Body.applyForce(newProj.body, projPos , dir)

	
    }

    draw() {
	let pos = this.getPosition()
	let domX, domY;
	domX = pos.x - this.rad;
	domY = pos.y - this.rad;
	this.domElement.style.transform =
	    "translate("+ domX + "px," + domY + "px" + ") " +
	    "rotate(" + pos.a*180/Math.PI +"deg )"

	push()
	ellipseMode(RADIUS)
	translate(pos.x, pos.y);
	rotate(pos.a);
	circle(0, 0, this.rad + this.outline);
	pop()
    }

}

class CircleProjectile extends WorldObj {
    constructor(x, y, physWorld, Obj) {
	super()
	this.tickable = false;
	this.static = false;
	this.hasGravity = true;
	this.rad = 10;
	this.domElement.className = "game-object circle-projectile"
	this.domElement.style.width = this.rad*2 + "px";
	this.domElement.style.height = this.rad*2 + "px";

	let bdy = M.Bodies.circle(x, y, this.rad);
	bdy.frictionAir = .00;
	bdy.restitution = 0.99;
	bdy.frictionStatic = 0;
	bdy.mass = 1.0
	bdy.intertia = 1.0
	//M.Body.setMass(bdy, 1000.0);
	this.addToWorld(bdy, physWorld, Obj);

    }

    draw() {
	let pos = this.getPosition();
	let domX, domY;
	domX = pos.x - this.rad;
	domY = pos.y - this.rad ;
	//this.domElement.style.transform =
	//    "translate("+ domX + "px," + domY + "px" + ") " +
	//    "rotate(" + pos.a*180/Math.PI +"deg )"
	circle(this.body.position.x, this.body.position.y, this.rad*2);

    }
}
