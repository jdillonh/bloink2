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
	    let velocity =
		Math.abs([bodyA.velocity.x, bodyA.velocity.y,
			  bodyB.velocity.x , bodyB.velocity.y]
			 .reduce((a,b)=>a+b,0));
	    ch.makeNote(bodyA, velocity);
	});
    },

    makeNote : function (bodyA, vel) {
	let obj = bodyA.parentObj
	let midiNote = map(vel, 0, constants.maxVelocity, 50, 65,
			   true /*stays in bound*/ );
	console.log(midiNote);
	midiNote = mtof(quantize(midiNote));
	this.voiceQueues[1].playNote(midiNote);
	/*switch(obj.type) {
	  case WorldObjType.circleEmmiter:
	  this.voiceQueues[obj.type].playNote(60);
	  break;
	  case WorldObjType.circle:
	  this.voiceQueues[obj.type].playNote(60);
	  break;

	  default:
	  break;

	  }*/
    }
}

function makeAllVoiceQueues(CollHand, connectionPoint) {
    CollHand.voiceQueues[WorldObjType.circleEmmiter] =
	makeVoiceQueue( Tone.Synth, connectionPoint);

    CollHand.voiceQueues[WorldObjType.circleProjectile] =
	makeVoiceQueue( Tone.Synth, connectionPoint);
}

function makeVoiceQueue(voiceType, connectionPoint) {
    let Q = {
	numVoices: constants.voicesPerType,
	currVoice: 0,
	voices: [],
	playNote : function(p) {
	    this.currVoice = (this.currVoice + 1) % this.numVoices;
	    this.voices[this.currVoice].triggerAttackRelease(p, '8n');
	},
    }
    for( let i = 0; i < Q.numVoices; i++ ) {
	let newVoice = new voiceType()
	let gainNode = new Tone.Gain(constants.perVoiceGainSettings);
	newVoice.connect(gainNode);
	gainNode.connect(connectionPoint);
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
	console.log("audio context initialized");
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
    console.log('degree', degree);
    console.log(octave*12 + scale[degree]);
    return octave*12 + scale[degree];
}
