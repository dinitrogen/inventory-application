var Category = require('../models/category');
var Item = require('../models/item');

var async = require('async');

// Handlebars helpers
Handlebars = require('hbs');

Handlebars.registerHelper('active', function(buttonId, pageId) {
    if (buttonId.toString() == pageId.toString()) {
        return true;
    } else return false;
});


// Display list of categories
exports.category_list = function(req, res) {
    Category.find({}, 'name')
        .exec(function (err, list_categories) {
            if (err) { return next(err); }

            res.render('category_list', { title: 'All categories', category_list: list_categories });
        });
};

// Display detail page for specific category
// TODO: Compare to the 'genre' page in the local library project
exports.category_detail = function(req, res) {

    async.parallel({
        category_list: function(callback) {
            Category.find({}, 'name', callback);
        },
        category_item_list: function(callback) {
            Item.find({ 'category': req.params.id }, 'name', callback)
        
        },
    }, function(err, results) {
        console.log(results, req.params);
        res.render('category_detail', { title: 'Category detail', error: err, data: results, pageId: req.params.id });
    });
};

// Display category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category create GET');
};

// Handle category create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category create POST');
};

// Display category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category delete GET');
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category delete POST');
};

// Display category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category update POST');
};

