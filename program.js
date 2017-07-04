var express = require("express")
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var path = require('path')
var fs = require("fs")
var app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))

app.set("view engine", "ejs")
app.set('views', 'project/views')

app.use(require("./routes/index.js"))

app.get("/", function(req, res) {
  if("name"in req.cookies){
    res.render("index",{stage:"welcome",username: req.cookies.name})
  }else{
    res.render('index',{stage :"login"})
  }

})


var users = Array.prototype.slice.call(require(path.join(__dirname, 'data/generated.json')).account);
app.post("/", function(req, res) {
  var index = -Infinity;
  for (var i = 0; i < users.length; i++) {
    if ((users[i].name == req.body.name) && (users[i].pass == req.body.pass)) {
      index = i;
      break;
    }
  }
  if (index == -Infinity) {
    res.send('<script>alert("Wrong username or password!!!"); location.href = "/"</script>')
  } else {
    res.cookie("name",req.body.name)
    res.render("index",{stage: "welcome", username: req.body.name })
  }
})

app.get("/signup", function(req,res){
  res.render("index",{stage:"signup"})
})
app.post("/signup", function(req,res){
  if(req.body.name == "" || req.body.pass == ""){
    res.send('<script>alert("Please input name and password!");location.href = "/signup"</script>')
  }else{
    users.push(req.body);
    fs.writeFile(path.join(__dirname, 'data/generated.json'), JSON.stringify({'account':users}), ()=>{});
    console.log(users);
    res.render("index", {stage:"welcome",username:req.body.name})
    //res.send('<script>alert("Successful!");location.href = "/"</script>')
  }
})
app.post("/logout", function(req,res){
  res.clearCookie('name')
  res.send('<script>location.href = "/"</script>')

})

app.listen(3000, function() {
  console.log("Server is listen at port 3000");
})
