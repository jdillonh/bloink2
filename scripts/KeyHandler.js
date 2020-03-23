var KeyHandler = {
    setup : function () {
	document.addEventListener( "keydown", event => {
	    switch(event.keyCode) {
	    case 67: // c
		console.log('C pressed');
		new CircleEmitter(width * Math.random(),
				  height * Math.random(),
				  World, Obj);
		break;
	    }
	})
    },

    update : function () {
	
    }
}

