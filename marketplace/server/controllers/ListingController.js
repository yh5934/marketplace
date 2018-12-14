let Listing = require("mongoose").model("Listing");
let User    = require("mongoose").model("User");

class ListingController{
	create(req,res){
		if(!req.session.uid){
            // if you are not in session go away
			return res.status(403).json({
				message:"You must be logged in to create a listing!",
				errors:"You must be logged in to create a listing!"
			});
		}
		let listing  = new Listing(req.body);
		listing.user = req.session.uid;
		listing.save(err=>{
			if(err){
				return res.status(403).json({
					message:"Failed to save listing.",
					errors:err					
				});
			}else{
				User.findOne({_id:req.session.uid},(err,user)=>{
					if(user){
						user.listings.push(listing._id);

						user.save(err=>{
							if(err){
								return res.status(403).json({
									message:"Failed to find user!",
									error:err
								});
							}else{
								console.log("CREATED LISTING");
								return res.status(200).json(listing);
							}
						});
					}else{
						return res.status(404).json({
							message:"Failed to find user!",
							error:err
						});
					}
                });
                
                return res.status(200).json(listing);
			}
		});
	}
	all(req,res){
		Listing.find({})
		.populate({
			path:"user",
			model:"User"
		})
		.exec((err,listings)=>{
			if(err){
				return res.status(403).json({
					message:"Failed to populate listing's user for listing: "+listing._id,
					errors:err
				});
			}else{
				return res.status(200).json(listings);
			}
		})
	}
	findById(req,res){
		Listing.findOne({_id:req.params.id})
		.populate({
			path:"user",
			model:"User"
		})
		.exec((err,listing)=>{
			if(err){
				return res.json({
					message:"Failed to populate listing's user for listing: "+listing._id,
					errors:err
				});
			}else{
				return res.json(listing);
			}
		})
	}
	update(req,res){
		Listing.findOne({_id:req.params.id},(err,listing)=>{
			if(listing){
				listing.title = req.body.title || listing.title;
				listing.description = req.body.description || listing.description;
				listing.price = req.body.price || listing.price ;
				listing.location = req.body.location || listing.location;
				listing.img = req.body.img || listing.img;

				listing.save(err=>{
					if(err){
						return res.status(403).json({
							message:"Failed to update listing: "+listing._id,
							errors:err
						});
					}else{
						return res.status(200).json(listing);
					}
				});
			}else{

			}
		});
	}

	destroy(req,res){
		Listing.findOne({_id:req.params.id},(err,listing)=>{
			if(listing){
				Listing.remove({_id:req.params.id},(err)=>{
					if(err){
						return res.status(403).json({
							message:"Failed to remove listing: "+req.params._id,
							errors:err
						}); 
					}else{
						return res.status(200).json(listing);
					}
				});
			}else{
				return res.status(403).json({
					message:"Failed to find listing:"+req.params.id,
					errors:err
				});
			}
		});
	}

	// lotd(req,res){
	// 	Listing.find({},(err,listings)=>{
	// 		let rand = Math.floor(Math.random()*listings.length);
	// 		return res.json(listings[rand]);
	// 	});
	// }
}

module.exports = new ListingController();
