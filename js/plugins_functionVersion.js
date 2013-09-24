// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

pngimate({
		targetContainer:$("#animcontainer"),
		filePath: "img/Shell/",
		sequenceStart: 1,
		sequenceEnd: 96
	},{
		loop: true,
		bufferSize: 15,
		tickSpeed: 5
});

function pngimate(required, options){	
	//REQUIRED
	var targetContainer = 	required.targetContainer 	|| null; 	//Element we're going to append into, needs to be a jquery object. We're going to empty this, so it needs to truly be a container.
	var filePath = 			required.filePath 			|| null;	//Path the the directory with pngs
	var sequenceStart = 	required.sequenceStart 		|| null;	//Starting number of the png sequence - eg 1 would be 1.png
	var sequenceEnd = 		required.sequenceEnd 		|| null;	//Ending number of the png sequence - eg 100 would be 100.png
	
	//OPTIONS
	var loop = 				options.loop 				|| false;	//Setting this will loop the sequence
	var loopStart = 		options.loopStart 			|| null; 	//TODO This will be replaced with an integer of the starting frame of the loop
	var loopEnd = 			options.loopEnd 			|| null;	//TODO This will be replaced with an integer of the ending frame of the loop
	var sequenceReverse = 	options.sequenceReverse 	|| false;	//Setting this to true will play the sequence backward from the end frame to the start frame
	var sequenceYoyo = 		options.sequenceYoyo 		|| false;	//Setting this to true will play the sequence fowards, and then at the end, play backwards
	var autoStyle = 		options.autoStyle 			|| true;	//Setting this to false will disable the automatic styling - setting the container dimensions and overflow
	var bufferSize = 		options.bufferSize 			|| 5;		//Increase or decrease amount of images contained in the buffer, can't be less than 2
	var noGPU = 			options.noGPU 				|| false;	//Setting this to true will not set a 3D transform on the container, potentially not invoking the GPU for rendering
	var debug = 			options.debug 				|| true;	//Setting this to true will push debug info to the console
	var tickSpeed = 		options.tickSpeed 			|| 15;		//Speed of animation, can't be less than 1
	var fileType = 			options.fileType 			|| "png";	//Override filetype
	
	//INTERNAL
	var animationTick = null;
	var currentFrame = 0;
	
	//LOGIC	
	init();
	
	function init()
	{
		checkErrors();
		
		targetContainer.html(""); //Clear contents of the container so we have a blank slate
		
		for (var i=sequenceStart; i < sequenceStart+bufferSize; i++)
		{	
			loadFrame(i); //Fill the buffer
		}
		
		targetContainer.children(":first").on("load", function(evt){loadedAndStart();}); //wait for the first image to load
	}
	
	function loadedAndStart()
	{
		//Now that we have our first image, we can set the style of the container and run.
		setContainerStyles();
		startAnimation();
	}
	
	function checkErrors(){
		//Here's where I tell you how wrong you are.
		//is the passed in targetContainer a JQ object?
		//do we have a filepath and is it a string?
		//do we have sequence start end end, and are they integers?
		
		//is loop a boolean
		//is loopstart and loopend an integer, and do we have both?
		//is sequenceReverse a boolean
		//is sequenceYoYo a boolean
		//is autoStyle a boolean
		//is buffersize an integer and greater than 2?
		//is noGPU a boolean
		//is debug a boolean
		//is tickspeed an integer and greater than 1
		//is filetype a string and less than 4 characters
	}
	
	function setContainerStyles()
	{
		if(autoStyle)
		{
			var targetWidth = targetContainer.children(":first").width();
			var targetHeight = targetContainer.children(":first").height();
			targetContainer.height(targetHeight).width(targetWidth).css("overflow", "hidden");
		}
		
		targetContainer.addClass("pngimate");
	}
	
	function loadFrame(frameNumber)
	{
		if (frameNumber)
		{
			targetContainer.append("<img src='"+filePath+frameNumber+"."+fileType+"' />");
			currentFrame = frameNumber;
		}
	}
	
	function removeFrame()
	{
		targetContainer.children(":first").remove();
	}
	
	function startAnimation()
	{
		animationTick = self.setInterval(function(){tickAnimation()},tickSpeed);
	}
	
	function stopAnimation()
	{
		animationTick = window.clearInterval(animationTick);
	}
	
	function tickAnimation()
	{		
		if (currentFrame+1 > sequenceEnd && loop)
		{
			loadFrame((currentFrame+1) - sequenceEnd); //if we're looping, get the next frame from the start of the loop
		} 
		else if(currentFrame < sequenceEnd)
		{
			loadFrame(currentFrame+1);//load the next frame if there are any more to load
		}
		
		if(targetContainer.children().length > 1)
		{
			removeFrame(); //if there's more than one image in the buffer, remove the last one
		}
		else
		{
			stopAnimation(); //otherwise, stop looping and we're done.
		}
	}
}