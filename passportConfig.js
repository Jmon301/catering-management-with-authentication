const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcryptjs');

function initialize(passport){
    const authenticateUser = (email, password, done) => {
        pool.query(
            'SELECT * FROM users WHERE user_email=$1', [email], (err, results) => {
                if(err){
                    throw err;
                }
                if(results.rows.length > 0){
                    const user = results.rows[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err){
                            throw err
                        }
                        if(isMatch){
                            console.log(user)
                            return done(null, user);
                        }else{                            
                            return done(null, false, {message: "Password is incorrect"})
                        }
                    })
                }
            }
        )
    }

    passport.use(new LocalStrategy({
        usernameField: "user_email",
        passwordField: "password"
    },
    authenticateUser
    ));
    passport.serializeUser((user, done) => done(null, user.user_id));
    passport.serializeUser((user, done) => {
        done(null, user.id)});

    passport.deserializeUser((id, done) => {
        pool.query('SELECT * FROM users WHERE user_id=$1', [id], (err, results) => {
            if(err){
                throw err;
            }
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;