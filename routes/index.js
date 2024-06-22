var express = require('express');
var router = express.Router();
const usermodel=require("./users")
const postmodel=require("./post")
const localStratergy=require("passport-local");
const passport = require('passport');
const upload= require('./multer') 
passport.use(new localStratergy(usermodel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { nav:false });
});

router.get('/register', function(req, res, next) {
  res.render('register',{ nav:false });
});

router.get('/profile', isLoggedIn,async function(req, res, next) {
  const user=
  await usermodel
  .findOne({username:req.session.passport.user})
  .populate("posts")
  console.log(user);
  res.render('profile',{user:user,nav:true});
});


router.get('/show/posts', isLoggedIn,async function(req, res, next) {
  const user=
  await usermodel
  .findOne({username:req.session.passport.user})
  .populate("posts")
  console.log(user);
  res.render('show',{user:user,nav:true});
});


router.get('/feed', isLoggedIn,async function(req, res, next) {
  const user= await usermodel.findOne({username:req.session.passport.user})
  const posts= await postmodel.find().populate("user")
  // console.log(posts);
  res.render('feed',{user:user,posts,nav:true});
});


router.get('/add', isLoggedIn,async function(req, res, next) {
  const user=await usermodel.findOne({username:req.session.passport.user})
  res.render('add',{user:user,nav:true});
  // res.send("addpage")
});


router.post('/createpost', isLoggedIn,upload.single("postimage"), async function(req, res, next) {
  const user=await usermodel.findOne({username:req.session.passport.user})
  const newPost= await postmodel.create({
    user:user._id,
    title: req.body.title,
    description:req.body.description,
    image:req.file.filename
  })
  // console.log(newPost);
  user.posts.push(newPost._id)
  await user.save()
  // console.log(user);
  res.redirect("profile")
  // res.send("addpage")
});


router.post('/fileupload', isLoggedIn,upload.single("image"),async function(req, res, next) {
 const user=await usermodel.findOne({username:req.session.passport.user})
 user.profileImage=req.file.filename;
 await user.save()
 res.redirect("/profile")
});

router.get("/login",(req,res,next)=>{
  res.render('profile',{ nav:false })
})  

router.post('/login',passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:'/'
}),
);


router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


router.post('/register', function(req, res, next) {
  const userdata=new usermodel({
    name:req.body.FullName,
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact
  })
  usermodel.register(userdata,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}

module.exports = router;
