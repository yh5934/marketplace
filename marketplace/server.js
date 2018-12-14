let express    = require("express");
let session    = require("express-session");
let flash      = require("express-flash");
let bodyParser = require("body-parser");
let mongoose   = require("mongoose");
let path       = require("path");
let bcrypt     = require("bcrypt");
let port       = 8000;

let app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/client/public/dist')));
app.use(flash());


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

app.listen(port,()=>{
	console.log("Listening on:",port)
});