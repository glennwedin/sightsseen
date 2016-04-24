import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost/sightsseen');
var Schema = mongoose.Schema;

var Point = mongoose.model('Point', { place_id: { type: String, unique: true }, point: { type: Schema.Types.Mixed, index: '2dsphere' }, name: String, images: Array});
var Image = mongoose.model('Image', { name: String, date: { type: Date, default: Date.now } });

var methods = {
	createPoint: function (data) {
		var image = new Image({
			name: data.image.name
		});
		//merge images
		var point = new Point({
			_id: data._id,
			place_id: data.place_id,
			point: { type: "Point", coordinates: [ parseFloat(data.lng), parseFloat(data.lat) ] },
			name: data.name
		});
		point.images.push(image);
		point.save(function (err, p) {
			if(err) {
				return { status: 0, message: 'Error' }
			} else {
				return { status: 1, message: 'Point created' }
			}
		});
	},

	updatePoint: function (data) {
		var image = new Image({
			name: data.image.name
		});

		Point.update({
				_id: data._id
			}, {
				$push: { images: image }
			}, {
				multi: false
			}, function (err) {
				console.log(err);
				if(err) {
					return { status: 0, message: 'Error' }
				}
				return { status: 1, message: 'Point updated' }
			}
		);
	},

	getNearbyPoints: function (pos, cb) {
		//Find points within 500 m
		Point.find({ 
				point: { 
					$nearSphere: { 
						$geometry: {
				        	type : "Point",
				        	coordinates : [ parseFloat(pos.lng), parseFloat(pos.lat) ]
				    	}, $maxDistance: 500
				    }
	    		}
	    	}, function (err, result) {
			cb(err, result);
		});
	},

	getPoint: function (id, cb) {
		Point.findOne({_id: id}, {images: 1}, function (err, result) {
			result.images.reverse();
			cb(err, result);
		});
	}
}

export default methods;