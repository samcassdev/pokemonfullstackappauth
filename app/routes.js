module.exports = function(app, passport, db) {

  // normal routes ===============================================================

      // show the home page (will also have our login links)
      app.get('/', function(req, res) {
          res.render('index.ejs');
      });

      // PROFILE SECTION =========================
      app.get('/profile', isLoggedIn, function(req, res) {
          db.collection('poke').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs', {
              user : req.user,
              poke: result
            })
          })
      });

      app.get('/poke', isLoggedIn, function(req, res) {
          db.collection('poke').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs', {
              // user : req.user,
              poke: req.body.result
            })
          })
      });

      // LOGOUT ==============================
      app.get('/logout', function(req, res) {
          req.logout();
          res.redirect('/');
      });

  // message board routes ===============================================================
// let pokemonName = document.getElementById('name')
      app.post('/poke', (req, res) => {
        db.collection('poke').save({name: req.body.name, img: req.body.image}, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/profile')
        })
      })

      app.put('/poke', (req, res) => {
        db.collection('poke')
        .findOneAndUpdate({name: req.body.name, ability: req.body.ability, version: req.body.version},
        {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      })

      app.put('/poke', (req, res) => {
        console.log("thumbDown");
        db.collection('poke')
        .findOneAndUpdate({name: req.body.name, ability: req.body.ability, version: req.body.version},
       {
          sort: {_id: -1},
          //sort through a document that matches and if it doesnt it will creates a doc
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      })

      app.delete('/poke', (req, res) => {
        // console.log("zoidberg", req, res);
        db.collection('poke').findOneAndDelete({name: req.body.poke}, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

      // locally --------------------------------
          // LOGIN ===============================
          // show the login form
          app.get('/login', function(req, res) {
              res.render('login.ejs', { message: req.flash('loginMessage') });
          });

          // process the login form
          //use a stratagey login authentican
          app.post('/login', passport.authenticate('local-login', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/login', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));

          // SIGNUP =================================
          // show the signup form
          app.get('/signup', function(req, res) {
              res.render('signup.ejs', { message: req.flash('signupMessage') });
          });

          // process the signup form
          app.post('/signup', passport.authenticate('local-signup', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/signup', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

      // local -----------------------------------
      app.get('/unlink/local', isLoggedIn, function(req, res) {
          var user            = req.user;
          user.local.email    = undefined;
          user.local.password = undefined;
          user.save(function(err) {
              res.redirect('/profile');
          });
      });

  };

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();

      res.redirect('/');
  }
