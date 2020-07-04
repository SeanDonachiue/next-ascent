const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Route = new Schema ({
	name: String,
	grade: String,
	gradePriority: Number,
	mplink: {type: String},
	location: [String],
	style: String,
	FA: String,
	description: String,
	images: [{
		author: String,
		link: String,
	}]
})
//tales an object in same format

module.exports = mongoose.model('routes', Route)