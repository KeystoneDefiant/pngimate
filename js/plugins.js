(function( $ ) {
 
	//PNGImate takes a directory of images, sequentially named, and then loads/unloads them at a defined speed to emulate animation

    $.fn.pngimate = function(options) {
		
		//Set defaults
		var settings = $.extend({
			filePath: 			null,		//String - Set path of where the files are
			sequenceStart: 		1,			//Integer - the first frame number in the sequence
			sequenceEnd: 		null,		//Integer - the last frame number in the sequence
			loop: 				false,		//Boolean - if we should loop or not
			autoStyle: 			true,		//Boolean - if we should automatically style the container
			bufferSize: 		5,			//Integer - Amount of images to have loaded at any given time. Bigger buffers are smoother, but more memory
			tickSpeed: 			15,			//Integer - Total speed of the animation. Lower numbers are faster
			fileType: 			"png"		//String - File extension
		}, options);

		//INTERNAL
		var animationTick = null;		//Holds the interval
		var currentFrame = 0;			//Holds the currently displayed frame number
		var targetContainer = null;		//Holds the container we're working with

        return this.each(function() {
			targetContainer = $(this);

			targetContainer.html(""); //Clear contents of the container so we have a blank slate

			for (var i = settings.sequenceStart; i < settings.sequenceStart + settings.bufferSize; i++)
			{	
				loadFrame(i, targetContainer); //Fill the buffer
			}

			targetContainer.children(":first").on("load", function(evt){
				loadedAndStart(targetContainer); //wait for the first image to load then finalize setup and run
			}); 
        });

		function loadedAndStart()
		{
			//Now that we have our first image, we can set the style of the container and run.
			setContainerStyles(targetContainer);
			startAnimation(targetContainer);
		}
		
		function setContainerStyles()
		{
			//We need to wait for the first image to load so we get proper height and width of the element, then set overflow to hidden.
			if(settings.autoStyle)
			{
				var targetWidth = targetContainer.children(":first").width();
				var targetHeight = targetContainer.children(":first").height();
				targetContainer.height(targetHeight).width(targetWidth).css("overflow", "hidden");
			}

			targetContainer.addClass("pngimate");  //Add a class to the element just to make life easier with external code.
		}
		
		function loadFrame(frameNumber)
		{
			//Append a new DOM element into the container
			if (frameNumber)
			{
				targetContainer.append("<img src='" + settings.filePath + frameNumber +"."+ settings.fileType + "' />");
				currentFrame = frameNumber;
			}
		}
		
		function removeFrame()
		{
			//Remove the oldest DOM element in the container
			targetContainer.children(":first").remove();
		}

		function startAnimation()
		{
			//Set an interval and run the main logic
			animationTick = window.setInterval(function(){
				tickAnimation(targetContainer)
			}, settings.tickSpeed);
		}

		function stopAnimation()
		{
			animationTick = targetContainer.clearInterval(animationTick); //Kill the interval, stop the looping
		}

		function tickAnimation()
		{
			//Check to see if we're looping and we would iterate past the last frame in the sequence
			if (currentFrame+1 > settings.sequenceEnd && settings.loop)
			{
				//if we're looping, get the next frame from the start of the loop
				loadFrame((currentFrame+1) - settings.sequenceEnd, targetContainer); 
			} 
			else if(currentFrame < settings.sequenceEnd)
			{
				//load the next frame if there are any more to load
				loadFrame(currentFrame+1, targetContainer);
			}

			//Remove the last image in the buffer. If there are no more images, stop the animation. Looping subverts the logic in the Else statement.
			if(targetContainer.children().length > 1)
			{
				//if there's more than one image in the buffer, remove the last one
				removeFrame(targetContainer);
			}
			else
			{
				//otherwise, stop looping and we're done.
				stopAnimation(targetContainer); 
			}
		}
 
    };
 
}( jQuery ));