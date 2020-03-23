/*
  idea:
  when you are moving a body with the mouseconstraint
  let it be non-static and have NO collisions 
  afterwards make it static again and allow collisions
*/

var M = Matter;

var colors = [
    "#FFABE5",
    "#9B9DE8",
    "#B8FFF2",
    "#C3E89B",
    "#FFD575",
];

var Engine;
var World;
var MouseConstraint;
var Mouse;
var KeyHandler;
var Obj = [];
let cnv;
let parent;

function setup() {
    cnv = createCanvas();
    cnv.parent('canvas-wrapper');
    parent = cnv.parent();
    resizeCanvas( parent.offsetWidth, parent.offsetHeight );
    Engine = M.Engine.create();
    World = Engine.world;
    World.gravity.scale = 0;
    //Mouse = M.Mouse.create(cnv.canvas);
    //Mouse.pixelRatio = pixelDensity();
    Mouse = M.Mouse.create(document.getElementById("game-elements"));

    //DEBUG
    M.World.addBody(World,
		    M.Bodies.rectangle(width/2, height-10, width, 40,
				       {}));
    Obj.push({draw: function() {
	rectMode(CENTER);
	rect(width/2, height-10, width, 40);
    }});
    MouseConstraint = M.MouseConstraint.create(
	Engine,{ element:document.getElementById("game-elements"),
		 //element: cnv.canvas,
		 mouse:Mouse,
	         constraint: {
		     stiffness: 0.2,
		     angularStiffness: 0.2,
		     damping: 0.9,
		 }});
    MouseHandler.setup(MouseConstraint);
    M.World.add(World, MouseConstraint);
    CollisionHandler.setup();
    KeyHandler.setup();

    for( let i = 0; i < 10; i++ ) {
	new Paddle(Math.random()*width, Math.random()*height, World, Obj);
    }

    /*
      p5 init
    */
    noStroke();
}

function draw() {
    background(colors[1]);
    M.Engine.update(Engine);
    for( let i = 0; i < Obj.length; i++ ) {
	Obj[i].draw();
    }
    CollisionHandler.update();
    MouseHandler.update();
    KeyHandler.update();
    //if(MouseConstraint.body) {
    //	MouseConstraint.body.collisionFilter.category = 0;
    //}

}

// p5 callback
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

//function mousePressed() {
//    if (Math.random() < 0.5) {
//	new Paddle(mouseX, mouseY, World, Obj)
//    }
//}
