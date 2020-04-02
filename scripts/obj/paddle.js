class WorldObj {
    constructor () {
	this.alpha = 1;
	this.body;
	this.domElement;
	this.outline = 10;
	this.tickable = false; //default
	this.static = true;
	this.hasGravity = false;
	this.hasDomElement = true;
	this.domElement = document.createElement("DIV");

	this.domElement.ondragstart = () => false;
	this.domElement.onwheel = (e) => {
	    let dx = e.deltaX;
	    let dy = e.deltaY;
	    M.Body.rotate(this.body, dy*constants.rotSpeed);
	}

    }

    addToWorld(body, physWorld, Obj) {
	if( this.hasDomElement ) {
	    document.getElementById("game-elements").appendChild(this.domElement);
	}
	else {
	    this.domElement = null;
	}
	this.body = body;
	this.body.parentObj = this;
	if( this.static ) {
	    M.Body.setStatic(this.body, true)
	}

	M.World.addBody(physWorld, this.body);
	Obj.push(this);
	if( this.tickable ) {
	    Tickables.push(this);
	}
	if( this.hasGravity ) {
	    GravityAffectees.push(this);
	}
    }

    removeFromWorld() {
	// TODO
    }

    getPosition () {
	return { x : this.body.position.x,
		 y : this.body.position.y,
	         a : this.body.angle }
    }

    OnMousePickup() {
	this.domElement.classList.add("active");
	M.Body.setStatic(this.body, false);
    }

    OnMouseDrop() {
	this.domElement.classList.remove("active");
	M.Body.setStatic(this.body, true);
    }

}

class Paddle extends WorldObj {

    constructor(x, y, physWorld, Obj) {
	super();
	this.w = 80
	this.h = 30
	this.domElement.className = "game-object paddle";
	this.domElement.style.width = this.w + "px";
	this.domElement.style.height = this.h + "px";
	let bdy = Matter.Bodies.rectangle(x, y, this.w, this.h);
	//bdy.isSensor = true;
	bdy.frictionAir = 0.5
	this.addToWorld(bdy, physWorld, Obj);
    }

    draw () {
	let pos = this.getPosition();
	let domX, domY;
	domX = pos.x -40;
	domY = pos.y -15;
	this.domElement.style.transform =
	    "translate("+ domX + "px," + domY + "px" + ") " +
	    "rotate(" + pos.a*180/Math.PI +"deg )"

	push()
	rectMode(CENTER)
	translate(pos.x, pos.y);
	fill(255);
	rotate(pos.a);
	rect(0, 0, this.w + this.outline, this.h + this.outline, this.outline/2);
	pop()
    }

}

