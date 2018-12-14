let User    = require("mongoose").model("User");
let Listing = require("mongoose").model("Listing");
let bcrypt  = require("bcrypt");

class UserController{
	register(req,res){
		User.findOne({email:req.body.email},(err,user)=>{
			if(user){
				return res.status(403).json({
					message:"Invalid Credentials!",
					errors:errs
				});
			}else{
				let user = new User(req.body);

				bcrypt.hash(req.body.password,8,function(err,hash){
					if(err){
						return res.status(403).json({
							message:"Failed to hash password!",
							errors:err							
						});
					}else{
						user.password = hash;

						console.log(user);

						user.save(errs=>{
							if(errs){
								return res.status(403).json({
									message:"Failed to save user!",
									errors:errs
								});
							}else{
								req.session.uid = user._id;
								return res.status(200).json(user);
							}
						});
					}
				});				

			}	
		});
	}

	login(req,res){
		User.findOne({email:req.body.email},(err,user)=>{
			if(user){
				bcrypt.compare(req.body.password,user.password,function(err,result){
					if(result){
						req.session.uid = user._id;
						return res.status(200).json(user);
					}else{
						return res.status(403).json({
							message:"Invalid Credentials!",
							errors:err
						});
					}
				});				
			}else{
				return res.status(403).json({
					message:"No user with this email was found!",
					errors:err
				});
			}
		});
	}

	logout(req,res){
		req.session.uid = undefined;
		return res.status(200).json({
			message:"Logged out successfully."
		});
	}

	findById(req,res){
		User.findOne({_id:req.params.id})
		.populate({
            // it takes in json object and needs two thing:models that should look into and attribute that you want to populate on the model User.
			path:"listings",
            model:"Listing"
            // path=attribute to populate
            
		})
		.exec((err,user)=>{
            // what to do after populate=execute;
			if(user){
				return res.status(200).json(user);
			}else{
				return res.status(404).json({
					message:"Failed to populate listings for user"+user._id,
					errors:err
				});
			}
		})
	}

	// session(){
	// 	return res.json({});
	// }
}

module.exports = new UserController();