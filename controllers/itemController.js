const { body, validationResult } = require('express-validator');
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
    Category.find({}, 'name')
        .exec(function(err, categories) {
            if (err) { return next(err); }

            res.render('item_form', {title: 'Add item to the armory', category_list: categories});
        });
};

// Handle item create on POST.
exports.item_create_post = [
    // Validate and sanitize
    body('name', 'Name must not be empty.').trim().isLength({ min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty and a non-zero integer').trim().isInt({min: 0}).escape(),
    body('quantity', 'Quantity must not be empty and a non-zero integer').trim().isInt({min: 0}).escape(),
    body('category', 'Category must not be empty').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item(
        {   name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category
        });

        if (!errors.isEmpty()) {
            Category.find({}, 'name')
            .exec(function(err, categories) {
                if (err) { return next(err); }

                res.render('item_form', {title: 'Add item to the armory', category_list: categories, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. save item.
            item.save(function(err) {
                if (err) { return next(err); }
                // successful - redirect to new item record
                res.redirect(item.url);
            });
        }
    }
];

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    Item.findById(req.params.id)
        .exec(function(err, item) {
            if (err) { return next(err); }
            if (item==null) {
                res.redirect('/inventory/items');
            }         

            res.render('item_delete', {title: 'Delete item', item:item});
        });
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