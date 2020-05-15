
const WorldObjType = {
    numVoiceTypes: 4, // circle, circleEmitter
    numTypes: 3,
    unset: -1,
    circleEmmiter: 0,
    circleProjectile : 1,
    squareEmmiter: 2,
    squareProjectile: 3,
    paddle: 4,

    voiceTypes: [Tone.Synth, Tone.Synth, Tone.Synth, Tone.Synth],
    voiceOptions: [
	{
	    oscillator : {
		type : "sine",
	    } ,
	    envelope : {
		attack : 0.005 ,
		decay : 0.1 ,
		sustain : 0.3 ,
		release : 1
	    }
	},
	{
	    oscillator : {
		type : "triangle"
	    } ,
	    envelope : {
		attack : 0.005 ,
		decay : 0.1 ,
		sustain : 0.3 ,
		release : 1
	    }
	},
	{
	    oscillator : {
		type : "sawtooth6"
	    } ,
	    envelope : {
		attack : 0.005 ,
		decay : 0.1 ,
		sustain : 0.3 ,
		release : 1
	    }
	},
	{
	    oscillator : {
		type : "sawtooth6"
	    } ,
	    envelope : {
		attack : 0.005 ,
		decay : 0.1 ,
		sustain : 0.3 ,
		release : 1
	    }
	}

    ],
}


class WorldObj {
    constructor () {
	this.type = WorldObjType.unset;
	this.alpha = 1;
	this.body = null;
	this.domElement = null;
	this.world = null;
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
	this.world = physWorld;
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
	M.World.remove(this.world, this.body);
	if(this.domElement) {
	    this.domElement.parentNode.removeChild(this.domElement);
	}
    }

    getPosition () {
	return { x : this.body.position.x,
		 y : this.body.position.y,
	         a : this.body.angle }
    }

    OnMousePickup() {
	let domEl = this.domElement;
	if( domEl !== null ) {
	    domEl.classList.add("active");
	    M.Body.setStatic(this.body, false);
	}
    }

    OnMouseDrop() {
	let domEl = this.domElement;
	if( domEl !== null ) {
	    domEl.classList.remove("active");
	    M.Body.setStatic(this.body, true);
	}
    }

}

class Paddle extends WorldObj {

    constructor(x, y, physWorld, Obj) {
	super();
	this.type = WorldObjType.paddle;
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
	return true;
    }

}

