const constants = {
    maxVelocity : 25, // the max velocity you *expect* 
    gravityStrength : 0.001,
    launchVelocity : .3,
    rotSpeed : 0.005,
    voicesPerType : 20,
    perVoiceGainSettings : {
	gain : 0.5 ,
	convert : true
    },
    QGainNodeSettings : {
	gain : 0.5 ,
	convert : true
    },
    compressionSettings : {
	ratio : 20,
	threshold : -24 ,
	release : 0.25 ,
	attack : 0.003 ,
	knee : 30
    }
}

var M = Matter;

var colors = [
    "#FFABE5",
    "#9B9DE8",
    "#B8FFF2",
    "#C3E89B",
    "#FFD575",
    "#FFC293",
];

var Engine;
var World;
var MouseConstraint;
var Mouse;
var KeyHandler;
var Obj = [];
var Tickables = []; // for objs that tick
var GravityAffectees = []
var cnv;

function setup() {

    cnv = createCanvas();
    cnv.parent('canvas-wrapper');
    let parent = cnv.parent();
    resizeCanvas( parent.offsetWidth, parent.offsetHeight );
    Engine = M.Engine.create();
    World = Engine.world;

    Engine.world.bounds.min.x = -Infinity;
    Engine.world.bounds.min.y = -Infinity;
    Engine.world.bounds.max.x = Infinity;
    Engine.world.bounds.max.y = Infinity;
    World.gravity.scale = 0.0;
    //Mouse = M.Mouse.create(cnv.canvas);
    //Mouse.pixelRatio = pixelDensity();
    Mouse = M.Mouse.create(document.getElementById("game-elements"));

    //DEBUG
    /*
      M.World.addBody(World,
      M.Bodies.rectangle(width/2, height-10, width, 40,
      {}));
      Obj.push({draw: function() {
      rectMode(CENTER);
      rect(width/2, height-10, width, 40);
      }});
    */

    MouseConstraint = M.MouseConstraint.create(
	Engine,{ element:document.getElementById("game-elements"),
		 //element: cnv.canvas,
		 mouse:Mouse,
		 constraint: {
		     stiffness: 0.2,
		     angularStiffness: 0.2,
		     damping: 0.1,
		 }});
    MouseHandler.setup(MouseConstraint);
    M.World.add(World, MouseConstraint);
    
    CollisionHandler.setup();
    KeyHandler.setup();
    ButtonHandler.setup();
    TickHandler.setup();


    /*
      p5 init
    */
    noStroke();
}

function draw() {
    background(colors[1]);
    M.Engine.update(Engine);
    let ave = 0;
    let numObj = 0;

    Obj = Obj.filter( (e) => {
	return e.draw();
    });

    MouseHandler.update();
    KeyHandler.update();
    TickHandler.update();
    applyGravity();
}

// p5 callback
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function applyGravity() {
    for( let i=0; i < GravityAffectees.length; i++ ) {
	let b = GravityAffectees[i].body;
	M.Body.applyForce(b, { x: b.position.x, y: b.position.y },
			  {x: 0, y: constants.gravityStrength});
    }
}
