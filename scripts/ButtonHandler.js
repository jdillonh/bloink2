var ButtonHandler = {
    setup : function () {
	// game object buttons
	let paddleEl = document.getElementById("paddle-button")
	paddleEl.onmousedown = this.makeSpawnFunc(Paddle, paddleEl);
	let circEl = document.getElementById("circle-emitter-button")
	circEl.onmousedown = this.makeSpawnFunc(CircleEmitter, circEl);
	let squareEl = document.getElementById("square-emitter-button")
	squareEl.onmousedown = this.makeSpawnFunc(SquareEmitter, squareEl);

	//right side buttons
	let optionsButton = document.getElementById("options-button")
	optionsButton.onclick = bringUp("options-screen-wrapper");
	let optionsScreenExit = document.getElementById("options-screen-exit");
	optionsScreenExit.onclick = closeEl("options-screen-wrapper");

	let helpButton = document.getElementById("options-help")
	helpButton.onclick = () => {
	    bringUp("help-screen-wrapper")();
	    document.getElementById("how-to-vid").play();
	};

	let helpScreenExit = document.getElementById("help-screen-exit");
	helpScreenExit.onclick = () => {
	    closeEl("help-screen-wrapper")();
	    document.getElementById("how-to-vid").pause();
	}

	document.getElementById("gear").onlick = () => {
	    console.log("clicked gear");
	    optionsButton.onclick();
	}
	let audioCtx = Tone.context._context; // hacking this lib a lil

	(function() {
	    let obj =  document.getElementById("cp-gain");
	    obj.oninput = () => {
		CollisionHandler.voiceQueues[WorldObjType.circleProjectile].localNode.gain.input.setTargetAtTime(
		    obj.value/100, audioCtx.currentTime, 0.2);
	    }
	})();
	(function() {
	    let obj =  document.getElementById("sp-gain");
	    obj.oninput = () => {
		CollisionHandler.voiceQueues[WorldObjType.squareProjectile].localNode.gain.input.setTargetAtTime(
		    obj.value/100, audioCtx.currentTime, 0.2);
	    }
	})();
	(function() {
	    let obj =  document.getElementById("se-gain");
	    obj.oninput = () => {
		CollisionHandler.voiceQueues[WorldObjType.squareEmmiter].localNode.gain.input.setTargetAtTime(
		    obj.value/100, audioCtx.currentTime, 0.2);
	    }
	})();
	(function() {
	    let obj =  document.getElementById("ce-gain");
	    obj.oninput = () => {
		CollisionHandler.voiceQueues[WorldObjType.circleEmmiter].localNode.gain.input.setTargetAtTime(
		    obj.value/100, audioCtx.currentTime, 0.2);
	    }
	})();

	let tempoInput = document.getElementById("tempo-input");
	document.getElementById("tempo-up").onclick = () => {
	    tempoInput.stepUp();
	    tempoVerify();
	};
	document.getElementById("tempo-down").onclick = () => {
	    tempoInput.stepDown();
	    tempoVerify();
	};

	let tempoVerify = () => {
	    let val = tempoInput.value;
	    let minVal = 40;
	    let maxVal = 200;
	    val = Math.min(Math.max(val, minVal), maxVal);
	    TickHandler.setTempo(val);
	    tempoInput.value = val;
	    console.log(val);
	}

	tempoInput.onchange = () => {
	    tempoVerify();
	};
	tempoInput.onkeypress = function(e){
	    if (!e) e = window.event;
	    var keyCode = e.keyCode || e.which;
	    if (keyCode == '13'){
		tempoVerify();
	    }
	};


    },
    makeSpawnFunc : function (newClass, buttonEl) {
	return (e) => {
	    let rect = buttonEl.getBoundingClientRect()
	    let x = e.clientX;
	    let y = e.clientY;
	    let newbie = new newClass(x, y, World, Obj)
	    newbie.domElement.style["z-index"] = 1000
	    simulate(document.getElementById("game-elements"),
		     "mousedown",
		     {pointerX : x, pointerY : y})
	}
    },
}

function bringUp(id) {
    let el = document.getElementById(id);
    return () => {
	el.style.display = "block";
    }
}

function closeEl(id) {
    let el = document.getElementById(id);
    return () => {
	el.style.display = "none";
    }
}




// this is from SO, simulates dom events so that can
// be forwarded to other elements
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
	    oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
	    oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
				  options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				  options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
	destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}
