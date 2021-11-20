@ECHO OFF
ECHO ***** 
ECHO This file will install npm and the dependecies required to run the Catering-Management-Application locally.
ECHO ***** 
PAUSE

call npm install
call npm install bcryptjs
call npm install cors
call npm install dotenv
call npm install ejs
call npm install express
call npm install express-flash
call npm install express-session
call npm install passport
call npm install passport-local
call npm install path
call npm install pg

ECHO ***** 
ECHO All the dependencies were installed correctly.
ECHO ***** 
PAUSE