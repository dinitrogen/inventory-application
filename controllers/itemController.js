var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');

exports.index = function(req, res) {
    Item.countDocuments({})
        .exec(function (err, count_items) {
            if (err) { return next(err); }
        
            res.render('home', { title: 'The Armory - Home', item_count: count_items });
        });
}   


// Display list of items
exports.item_list = function(req, res) {
    Item.find({}, 'name category')
        .populate('category')
        .exec(function (err, list_items) {
            if (err) { return next(err); }

            res.render('item_list', { title: 'All items', item_list: list_items });
        });
};

// Display detail page for specific item
exports.item_detail = function(req, res) {
    async.parallel({
        category_list: function(callback) {
            Category.find({}, 'name', callback);
        },
        item: function(callback) {
            Item.findById(req.params.id, 'name description category', callback)
        
        },
    }, function(err, results) {
        res.render('item_detail', { title: 'Item detail', error: err, data: results });
    
    });
};

// Display item create form on GET.
exports.item_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item create GET');
};

// Handle item create on POST.
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item create POST');
};

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};