@ECHO OFF
ECHO ***** 
ECHO This file will run a local server. Please leave this window open while the server is running. Press "ctrl" + "c" to stop the server.
ECHO ***** 
PAUSE

start "" http://localhost:4000/
call node server.js

