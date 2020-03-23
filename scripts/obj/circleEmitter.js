class CircleEmitter extends WorldObj {

    constructor (x, y, physWorld, Obj) {
	super()
	this.rad = 40;
	var newDiv = document.createElement("DIV");
	newDiv.className = "game-object circle-emitter"
	newDiv.ondragstart = () => false;

	this.domElement = document.getElementById("game-elements").appendChild(newDiv);
	this.domElement.style.width = this.rad*2 + "px";
	this.domElement.style.height = this.rad*2 + "px";

	let bdy = M.Bodies.circle(x, y, this.rad);
	bdy.frictionAir = 0.5;
	this.addToWorld(bdy, physWorld, Obj);
    }

    draw() {
	let pos = this.getPosition()
		let domX, domY;
	domX = pos.x -40;
	domY = pos.y - 58;
	this.domElement.style.transform =
	    "translate("+ domX + "px," + domY + "px" + ") " +
	    "rotate(" + pos.a*180/Math.PI +"deg )"

	push()
	ellipseMode(RADIUS)
	translate(pos.x, pos.y);
	rotate(pos.a);
	circle(0, 0, this.rad);
	pop()
    }

}
