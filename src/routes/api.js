import express from "express";
import mongoose from 'mongoose';
import multer from "multer";
import sharp from "sharp";
import db from "./db";
import fs from "fs";
var apirouter = express.Router();

//The path to where the uploaded images are stored
var imgpath = '/var/www/sightssen/uploads';

var multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgpath);
    },
    filename: function (req, file, cb) {
    	var ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + Date.now()+'.'+ext);
	}
});
var upload = multer({ 
	storage: multerStorage
});


var parsefile = function (name, id) {
	var dir = imgpath+'point-'+id;

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	sharp(imgpath+name)
	  .resize(200, 200)
	  .toFile(imgpath+'point-'+id+'/small-'+name, function(err) {
	    // output.jpg is a 300 pixels wide and 200 pixels high image
	    // containing a scaled and cropped version of input.jpg
	});
	sharp(imgpath+name)
	  .resize(1600)
	  .toFile(imgpath+'point-'+id+'/standard-'+name, function(err) {
	    // output.jpg is a 300 pixels wide and 200 pixels high image
	    // containing a scaled and cropped version of input.jpg
	});
}

apirouter.get('/t', function (req, res, next) {
	res.json({'status': 1, 'message': 'This is the api, you should probably not be here.'})
});

apirouter.post('/nearbypoints', function (req, res, next) {
	var lat = req.body.lat,
		lng = req.body.lng;

	db.getNearbyPoints({lat: lat, lng: lng}, function (err, result) {
		if(err) {
			console.log(err, result);
		}

		res.json(result);
	});

});

apirouter.get('/image/:id', function (req, res, next) {
	/*
	var imageid = req.params.id;

	db.getImage(imageid, function (err, result) {

	});
	*/
});

apirouter.get('/point/:id', function (req, res, next) {
	var id = req.params.id;
	db.getPoint(id, function (err, result) {
		res.json(result);
	});
});

apirouter.post('/point/:id', upload.single('file'), function (req, res, next) {
	var id = req.params.id;
	if(req.file.filename) {

		//Resize
		parsefile(req.file.filename, id);

		var status = db.updatePoint({
			_id: id,
			image: {
				name: req.file.filename,
				mimetype: req.file.mimetype
			}
		});
		res.json({'status': 1, _id: id});
	} else {
		res.json({'status': 0});
	}
});

apirouter.post('/point', upload.single('file'), function (req, res, next) {
	var title = req.body.title,
		place_id = req.body.place_id,
		lat = req.body.lat,
		lng = req.body.lng,
		_id = mongoose.Types.ObjectId();

	if(req.file.filename) {

		//Resize
		parsefile(req.file.filename, _id);

		var status = db.createPoint({
			_id: _id,
			place_id: place_id,
			lat: lat,
			lng: lng,
			name: title,
			image: {
				name: req.file.filename,
				mimetype: req.file.mimetype
			}
		});
		res.json({'status': 1, _id: _id});
	} else {
		res.json({'status': 0});
	}
});

export default apirouter;
