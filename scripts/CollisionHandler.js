var CollisionHandler = {
    // since audio happens at collisions, audio is
    // mostly handled here too
    voiceQueues : new Array(WorldObjType.numVoiceTypes),
    setup : function () {
	setupAudioContext();
	let ch = this;
	M.Events.on(Engine, 'collisionStart', function(event) {
	    let bodyA = event.pairs[0].bodyA
	    let bodyB = event.pairs[0].bodyB
	    /* let velocity =
	       [bodyA.velocity.x, bodyA.velocity.y,
	       bodyB.velocity.x , bodyB.velocity.y]
	       .map(Math.abs)
	       .reduce((a,b)=>a+b,0)
	    */

	    ch.makeNote(bodyA, Math.abs(bodyA.velocity.x)
			+ Math.abs(bodyA.velocity.y));
	    ch.makeNote(bodyB, Math.abs(bodyB.velocity.x)
			+ Math.abs(bodyB.velocity.y));
	});
    },

    makeNote : function (bodyA, vel) {
	let obj = bodyA.parentObj
	if( obj.type >= WorldObjType.numVoiceTypes ) {
	    return;
	}

	let midiNote = map(vel, 0, constants.maxVelocity, 40, 80,
			   false /*stays in bound*/ );
	midiNote = mtof(quantize(midiNote));
	this.voiceQueues[obj.type].playNote(midiNote);
    }
}

function makeAllVoiceQueues(CollHand, connectionPoint ) {
    let wot = WorldObjType;
    for( let i = 0; i < wot.numVoiceTypes; i++ ) {
	CollHand.voiceQueues[i] =
	    makeVoiceQueue( wot.voiceTypes[i],
			    connectionPoint,
			    i );
    }
}

function makeVoiceQueue(voiceType, connectionPoint, typeNum) {
    let Q = {
	localNode: new Tone.Gain(constants.QGainNodeSettings),
	numVoices: constants.voicesPerType,
	currVoice: 0,
	voices: [],
	playNote : function(p) {
	    this.currVoice = (this.currVoice + 1) % this.numVoices;
	    this.voices[this.currVoice].triggerAttackRelease(p, '8n');
	},
    }
    Q.localNode.connect(connectionPoint);
    for( let i = 0; i < Q.numVoices; i++ ) {
	let newVoice = new voiceType(WorldObjType.voiceOptions[typeNum]);
	let gainNode = new Tone.Gain(constants.perVoiceGainSettings);
	newVoice.connect(gainNode);
	gainNode.connect(Q.localNode);
	Q.voices.push(newVoice); 
    }
    return Q
}

function setupAudioContext() {
    let wrap = document.getElementById("audio-pls-wrapper");
    let button = document.getElementById("audio-pls-button");

    button.onclick = async () => {
	removeElement(wrap);
	await Tone.start();
	console.log("Audio Context Initialized");
	let comp = new Tone.Compressor(constants.compressionSettings)
	comp.toMaster();
	makeAllVoiceQueues(CollisionHandler, comp);
    }
}
function removeElement(element) {
    element.parentNode.removeChild(element);
}

function mtof(m) {
    let f = Tone.Frequency(m, "midi");
    return f;
}


function quantize(midiNote) {
    let scale = [0, 2, 4, 7, 9]; // major pentatonic
    let octave = Math.floor(midiNote/12)
    let degree = Math.floor(map(midiNote - (octave*12), 0, 12, 0, scale.length-1));
    return octave*12 + scale[degree];
}
