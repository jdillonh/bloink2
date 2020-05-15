/* 
   TODO
   css: square-projectile
*/


class SquareEmitter extends WorldObj {

    constructor (x, y, physWorld, Obj) {
	super()
	this.type = WorldObjType.squareEmmiter; //TODO change me
	this.tickable = true;
	this.size = 80;
	this.domElement.className = "game-object square-emitter"
	this.domElement.style.width = this.size + "px";
	this.domElement.style.height = this.size + "px";
	this.littleSquare = document.createElement("DIV");
	this.littleSquare.className = "little-square";
	this.domElement.appendChild(this.littleSquare)

	let bdy = M.Bodies.rectangle(x, y, this.size, this.size);
	bdy.frictionAir = 0.5;
	this.addToWorld(bdy, physWorld, Obj);


    }

    onTick() {
	//called when tempo ticks
	let rect = this.littleSquare.getBoundingClientRect();
	let lilCirclePos = createVector( rect.x + rect.width/2,
					 rect.y + rect.height/2);
	let pos = createVector( this.body.position.x,
				this.body.position.y )
	let dir = lilCirclePos.sub(pos)
	let projPos = pos.add(dir.mult(1.85)); 

	//TODO make this Square Projectile
	let newProj = new SquareProjectile(projPos.x, projPos.y, World, Obj);
	M.Body.setVelocity(newProj.body, dir.mult(constants.launchVelocity));
	//M.Body.applyForce(newProj.body, projPos , dir)

	
    }

    draw() {
	let pos = this.getPosition()
	let domX, domY;
	domX = pos.x - this.size/2;
	domY = pos.y - this.size/2;
	this.domElement.style.transform =
	    "translate("+ domX + "px," + domY + "px" + ") " +
	    "rotate(" + pos.a*180/Math.PI +"deg )"
	rectMode(CENTER);
	push()
	translate(pos.x, pos.y);
	rotate(pos.a);
	//circle(0, 0, this.rad + this.outline);
	let squareSize = this.size + (this.outline * 1.6);
	rect(0, 0, squareSize, squareSize, this.outline/2);
	pop()

	return true;
    }

}


class SquareProjectile extends WorldObj {
    constructor(x, y, physWorld, Obj) {
	super()
	this.type = WorldObjType.squareProjectile;
	this.tickable = false;
	this.static = false;
	this.hasGravity = true;
	this.hasDomElement = false;
	this.size = 20;
	this.domElement.className = "game-object square-projectile"
	this.domElement.style.width = this.size + 'px';
	this.domElement.style.height = this.size + 'px';

	let bdy = M.Bodies.rectangle(x, y, this.size, this.size);
	bdy.frictionAir = .00;
	bdy.restitution = 0.99;
	bdy.frictionStatic = 0;
	bdy.mass = 1.0
	bdy.intertia = 1.0
	//M.Body.setMass(bdy, 1000.0);
	this.addToWorld(bdy, physWorld, Obj);

    }

    draw() {
//	let x = this.body.position.x;
//	let y = this.body.position.y;
//	let r = this.body.rotation;
	let pos = this.getPosition();
	rectMode(CENTER);
	push();
	translate(pos.x, pos.y);
	rotate(pos.a);
	rect(0, 0, this.size, this.size);
	pop();

	if( pos.y > window.innerHeight ) {
	    this.removeFromWorld();
	    return false;
	}
	return true;
    }
}
