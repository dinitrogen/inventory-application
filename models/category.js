var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100 },
        description: {type: String, required: true, maxLength: 100 },
    }
);

// Virtual properties
CategorySchema
    .virtual('url')
    .get(function() {
        return '/inventory/category/' + this._id;
    });

//Export
module.exports = mongoose.model('Category', CategorySchema);