class WorldObj {
    constructor () {
	this.alpha = 1;
	this.body;
	this.domElement;
    }

    addToWorld(body, physWorld, Obj) {
	this.body = body;
	this.body.parentObj = this;
	M.World.addBody(physWorld, this.body);
	Obj.push(this);
    }

    getPosition () {
	return { x : this.body.position.x,
		 y : this.body.position.y,
	         a : this.body.angle }
    }

    OnMousePickup() {
	this.domElement.focus()
    }

    OnMouseDrop() {
	this.domElement.blur()
    }

}

class Paddle extends WorldObj {

    constructor(x, y, physWorld, Obj) {
	super();
	this.w = 80
	this.h = 30
	var newDiv = document.createElement("DIV");
	newDiv.className = "game-object paddle";
	newDiv.ondragstart = () => false;
	this.domElement = document.getElementById("game-elements").appendChild(newDiv);
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
	domY = pos.y -33;
	this.domElement.style.transform =
	    "translate("+ domX + "px," + domY + "px" + ") " +
	    "rotate(" + pos.a*180/Math.PI +"deg )"

	push()
	rectMode(CENTER)
	translate(pos.x, pos.y);
	fill(255);
	rotate(pos.a);
	let outline = 10
	rect(0, 0, this.w + outline, this.h + outline, outline/2);
	pop()
    }

}

