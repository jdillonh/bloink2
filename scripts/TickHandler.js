

var TickHandler = {
    setup : function() {
	this.tempo = null;
	this.tempoMs = null;
	this.setTempo(100);
	this.time = 0;
	this.lastFrameTime = performance.now();
    },

    update : function() {
	let newTime = performance.now()
	this.time += newTime - this.lastFrameTime;
	this.lastFrameTime = newTime;

	if( this.time > this.tempoMs ) {
	    this.time = this.time - this.tempoMs
	    this.time = this.time % this.tempoMs
	    this.tick();
	}
	
    },

    setTempo : function( newTempo ) {
	this.tempo = newTempo;
	this.tempoMs = 60000/newTempo;
    },

    tick : function() {
	for( let i = 0; i < Tickables.length; i++ ) {
	    Tickables[i].onTick()
	}
    }
    
}
