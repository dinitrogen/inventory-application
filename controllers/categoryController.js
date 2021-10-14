const { body, validationResult } = require('express-validator');
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

Handlebars.registerHelper('getFormValue', function(object, parameter) {
    if (undefined===object) {
        return '';
    } else {
        return object[parameter];
    }
});

Handlebars.registerHelper('isSelected', function(item, id) {
    if (id.toString() === item.category._id.toString() || id.toString() === item.category) {
        return true;
    } else return false;
});

Handlebars.registerHelper('concat', function(strA, strB) {
    return strA.concat(strB);
});

Handlebars.registerHelper('hasMembers', function(array) {
    if (array.length > 0) {
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
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
        category_item_list: function(callback) {
            Item.find({ 'category': req.params.id }, 'name description', callback)
        
        },
    }, function(err, results) {
    
        res.render('category_detail', { title: 'Category detail', error: err, data: results, pageId: req.params.id });

    });
};

// Display category create form on GET.
exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Create Category' });
};

// Handle category create on POST.
exports.category_create_post = [
    //Validation
    body('name', 'Name must not be empty.').trim().isLength({ min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('category_form', { title: 'Create Category', category: req.body, errors: errors.array() });
            return;
        }
        else {
            var category = new Category(
                {
                    name: req.body.name,
                    description: req.body.description
                });
            category.save(function(err) {
                if (err) {return next (err); }
                res.redirect(category.url);
            });
        }
    }
];


// Display category delete form on GET.
exports.category_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
        category_items: function(callback) {
            Item.find({'category': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) {
            res.redirect('/inventory/categories');
        }
        res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items });
    });
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.body.categoryid).exec(callback)
        },
        category_items: function(callback) {
            Item.find({ 'category': req.body.categoryid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }

        if (results.category_items.length > 0) {
            res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items });
            return;
        }
        else {
            Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
                if (err) { return next(err); }

                res.redirect('/inventory/categories')
            })
        }
    });
};

// Display category update form on GET.
exports.category_update_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if(err) { return next(err); }
        if (results.category==null) {
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_form', {title: 'Update category', category: results.category });
    });
};

// Handle category update on POST.
exports.category_update_post = [
    //Validate
    body('name', 'Name must not be empty.').trim().isLength({ min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var category = new Category(
            {
                name: req.body.name,
                description: req.body.description,
                _id: req.params.id
            });
        
        if (!errors.isEmpty()) {
          res.render('category_form', { title: 'Update Category', category: category, errors: errors.array() });
        
        }
        else {
            Category.findByIdAndUpdate(req.params.id, category, {}, function(err, thecategory) {
                if (err) { return next(err); }
                res.redirect(thecategory.url);
            });
        }
    }
]

