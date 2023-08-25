# fluidCommander - Fluidsynth on Raspberry Pi

Using a Raspberry PI as a synthesizer is not only practical but fun too. I have found several projects online with instruction for building one. Most of them are a bit dated and things don't always work as well as you might hope.  So depending on your inclination to sort out those issues, following these can be a challenge.

I found one such project that I liked because:
* It uses the PI Zero W.
** I had one on hand
** It is small and can be easily powered by a power brick
* This project also shows how to control the synth (Instrument selection) from another device via a web browser (Phone??)

Those project instructions can be found here: https://lucidbeaming.com/blog/running-fluidsynth-on-a-raspberry-pi-zero-w/
(Thanks Joshua Curry...  Good work)

When I came to buildng the NODEJS part of the project, the applicatioin would not run on the PI. After some research, I determined that some things had changed the code needed a little upgrade. So in addition to the upgrade, I also made some modifications to the stratgy used to organize (and maybe simplify) the code.

So, head on over to Joshua's instructions and build a synth for yourself. When you come to the point where you install the node and the control app... come back here and finish up.

As of this writing, the latest version of Node for the ARM v61 is: v10.24.1
Fluidsynth no longer needs to be build from source (Use apt-get)

Please enjoy!
