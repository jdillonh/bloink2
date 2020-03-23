var MouseHandler = {
    setup : function ( constraint ) {
	this.constraint = constraint;
	this.currentBody = constraint.body;
	this.lastBody = null;
    },

    update : function () {
	// object released
	if( this.constraint.body === null &&
	    this.currentBody !== null ) {
	    this.currentBody.parentObj.OnMouseDrop()
	    this.currentBody.collisionFilter.category = 1;
	    this.currentBody = null;

	}
	// object picked up
	else if( this.constraint.body !== null &&
		 this.currentBody === null ) {
	    this.currentBody = this.constraint.body;
	    this.currentBody.collisionFilter.category = 0.5;

	    this.currentBody.parentObj.OnMousePickup()
	    //Obj.splice(Obj.indexOf(this.currentBody.parentObj),1)
	    //Obj.push(this.currentBody.parentObj)
	}
    }
}

