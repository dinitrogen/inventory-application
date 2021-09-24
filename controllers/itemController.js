const { nextTick } = require('async');
var Item = require('../models/item');

exports.index = function(req, res) {
    res.send('Site home page');
};


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
    res.send('TODO detail');
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