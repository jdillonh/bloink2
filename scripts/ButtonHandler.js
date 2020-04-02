

var ButtonHandler = {
    setup : function () {
	let paddleEl = document.getElementById("paddle-button")
	paddleEl.onmousedown = this.makeSpawnFunc(Paddle, paddleEl);
	let circEl = document.getElementById("circle-emitter-button")
	circEl.onmousedown = this.makeSpawnFunc(CircleEmitter, circEl);

    },
    makeSpawnFunc : function (newClass, buttonEl) {
	return (e) => {
	    console.log(e)
	    //TODO remove buttonEl
	    let rect = buttonEl.getBoundingClientRect()
	    let x = e.clientX;
	    let y = e.clientY;
	    let newbie = new newClass(x, y, World, Obj)
	    newbie.domElement.style["z-index"] = 1000
	    simulate(document.getElementById("game-elements"),
		     "mousedown",
		     {pointerX : x, pointerY : y})
	}
	window.setTimeout( () => {
	    console.log("focusing")
	    newbie.domElement.focus();
	}, 0);
    },
}

// SO
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
