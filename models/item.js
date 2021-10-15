var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100 },
        description: {type: String, required: true, maxLength: 100 },
        price: {type: Number, required: true},
        quantity: {type: Number, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        img: {
            file: { type: Buffer,required: true },
            filename: {type: String, required: true },
            mimetype: {type: String, required: true },
        },
    }
);

// Virtual properties
ItemSchema
    .virtual('url')
    .get(function() {
        return '/inventory/item/' + this._id;
    });

//Export
module.exports = mongoose.model('Item', ItemSchema);