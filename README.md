XtremeDoorbell
==============

Node.js based client and server for remotely playing an audio file

This project was started to further explore Node.js and the Raspberry Pi (www.raspberrypi.org) platform, and is provided as open source through the MIT license.
The following blog provides some further description and outlines the inspiration for the project.

=====

An Xtreme Doorbell

The daily morning standup is an important part of Xtreme Labs culture. It lets us exchange news and tips that we’ve discovered from the previous day. When Xtreme Labs was all on one floor at our office, it was relatively easy to announce the start of standup. As the Labs has grown to encompass three floors in our Toronto headquarters, it has become more difficult.

In the past, we’ve used a doorbell on each of the separate floors which we ring to denote that standup was about to start. Simple and effective, but lacking on the “coolness factor”. To improve the system, we decided that we could create our own Linux powered doorbells that could play arbitrary MP3s to announce the start of standup (definitely up’ing the “coolness factor”).

Architecturally, our new doorbell system is composed of doorbell “nodes” which connect to a cloud-based server. The server provides a web site from which the user can see a list of connected nodes and click a button to trigger the doorbell nodes. When the button is clicked, the server broadcasts a JSON command to each of the nodes telling them to play the MP3 located at an arbitrary URL (letting us easily change the MP3, since it’s hosted on the server).

The Raspberry Pi computer (http://www.raspberrypi.org) seemed like a perfect platform to create the doorbell nodes from. Basically, the Raspberry Pi is an ARM11 based computer that runs Linux. With Linux on the doorbell nodes, we then could use Node.js (http://nodejs.org) to write a simple client to connect to the server and execute the commands that it receives from the server.

The server for the doorbell nodes was also written in Node.js. It provides a simple web services API for the nodes and the user facing HTML to talk to, while also serving the HTML and audio files through a simple HTTP server.

At Xtreme Labs, we love to build cool things. The Raspberry Pi provides an extremely low-cost platform, combined with the power of Linux and Node.js, making it a treat to create cool projects with. Source code for the Node.js client and server are available on GitHub.
