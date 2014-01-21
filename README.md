PNGImate
========

Description
-----------
This is a little chunk of code to handle a continuing issue we ran into. We do a lot of work with some proprietary iPad applications that run an HTML page in a Webview. Our creative usually requires us to animate multiple things on the screen at the same time, most times with transparency. Mobile Safari's video tag implementation only allows one video to be playing at any given time, without transparency. As such, we use PNG sequences often to make these animations happen.

We've attempted to tackle this problem from a number of different directions - swapping the background image of an IMG tag quickly, swapping the SRC tag of an IMG tag, and even using the drawing and loading routines in a Canvas tag. I took a more direct route and tried DOM manipulation - specifically setting up a container with hidden overflow, and doing fast appending and removal of DOM elements. The plus side is that we get all the bonuses of having an image loaded in the DOM, most importantly caching. The downside of this is that this method is harder on the processor and memory since we are continually modifying the document structure and forcing a repaint. Adding in buffer size and animation speed options can help mitigate some possible issues in low-memory situations.

The code was originally built as a simple function as a prototype, building in a number of settings in initialization as reminders for future expansion. I converted it to a jQuery plugin, mostly as an educational exercise. After working with it further, I kept going down the plugin route as it makes a little more sense as it covers some edge cases we run into from time to time, such as needing the same image animated across multiple objects. With this structure, what might have been an N-line situation is now a simple 1-line solution. The original function-based version is included for information purposes.


File Structure
--------------
/js/main.js - The invoker for the jQuery plugin version
/js/plugins.js - The actual jQuery plugin version of PNGImator
/js/plugins_functionVersion.js - The original version of PNGImator that was a simple function.


TODO
----
*More testing on multiple selector types
*Error handling
*Automatic Frame End detection
*Play Backwards
*Sequence Start and Loop Start options, so that you can play a sequence from one spot, but repeat the loop from another
For instance, the sequence starts on frame 1, but repeats the loop on frame 20.
*Looping with Yo-Yo effect (play backwards after playing forwards)