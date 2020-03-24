var MouseHandler = {
    setup : function ( constraint ) {
	this.constraint = constraint;
	this.currentBody = constraint.body;
	this.lastBody = null;
	//TODO make this more specific
	this.buttons = document.getElementsByTagName("button");
    },

    update : function () {
	// object released
	if( this.constraint.body === null &&
	    this.currentBody !== null ) {
	    this.currentBody.parentObj.OnMouseDrop()
	    this.currentBody.collisionFilter.category = 1;
	    this.currentBody = null;
	    this.setShelfActive(true)
	}
	// object picked up
	else if( this.constraint.body !== null &&
		 this.currentBody === null ) {
	    this.setShelfActive(false)
	    this.currentBody = this.constraint.body;
	    this.currentBody.collisionFilter.category = 0.5;
	    this.currentBody.parentObj.OnMousePickup()
	}
    },

    setShelfActive : function ( on ) {
	let newState = on ? "all" : "none";
	for( let i = 0; i < this.buttons.length; i++ ) {
	    this.buttons[i].style["pointer-events"] = newState;
	}
    },
}

