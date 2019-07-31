const mongoose = require('mongoose');
const ArticleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String },
	description: { type: String, required: true },
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'comment',
		},
	],

	date: { type: Date, default: Date.now},
});

module.exports = mongoose.model('article', ArticleSchema);
//