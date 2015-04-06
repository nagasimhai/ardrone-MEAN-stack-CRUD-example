# ardrone-MEAN-stack-CRUD-example
This is a utility that builds, flies and stores parrot ar-drone paths on MongoDB using NodeJS, AngularJs and Express.
I built it as an exercise to learn the above.

This is a handy utility for all Parrot AR drone fliers out there to control your drone from your laptop/tablet. 

Here are the steps:
1. Install NodeJS.
2. Install mongoDB.
  2a] Create database dronedb;
  2b] Use the dbcommands file to create operations table and populate it with the operations from the ARDrone SDK.
3. Install Express.
4. npm install all missing/needed libraries.
5. Turn on parrot drone and connect laptop to its wifi.
6. Start server.js with nodejs.
7. In your browser, http://localhost:3013

Here are the things your can do:
1. Fly drone with basic commands using buttons for them. Set the speed for the movements.
2. Record a series of movements and give it a name. Use the Fly all button to fly the drone with the series of movements.

Upcoming: GPS integration, distance traversing, more complicated movements.
