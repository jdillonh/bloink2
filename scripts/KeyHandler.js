var KeyHandler = {
    setup : function () {
	document.addEventListener( "keydown", event => {
	    switch(event.keyCode) {
	    case 67: // c
		clearProjectiles();
		break;
	    case 88: //x
		clearEverything();
		break;
	    }
	})
    },

    update : function () {
	
    }
}

function clearEverything() {
    Obj.forEach( o => {
	o.removeFromWorld();
    });
    Obj = [];
}

function clearProjectiles() {
    Obj = Obj.filter( (o) => {
	if( o.type === WorldObjType.circleProjectile ||
	    o.type === WorldObjType.squareProjectile ) {
	    o.removeFromWorld();
	    return false;
	}
	return true;
    })
}
