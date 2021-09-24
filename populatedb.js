#! /usr/bin/env node

console.log('This script populates some test data to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function categoryCreate(name, description, cb) {
  categorydetail = {name:name , description: description }
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}


function itemCreate(name, description, price, quantity, category, cb) {
  itemdetail = { 
    name: name,
    description: description,
    price: price,
    quantity: quantity,
    category: category,
  }
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Weapon', 'Affects attack strength', callback);
        },
        function(callback) {
          categoryCreate('Shield', 'Affects defense and agility', callback);
        },
        function(callback) {
          categoryCreate('Helmet', 'Affects defense', callback);
        },
        function(callback) {
          categoryCreate('Armor', 'Affects defense', callback);
        },
        function(callback) {
          categoryCreate('Consumable', 'Restores health, status, or provide temporary boosts', callback);
        },
        
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Sword', 'Attack: 10', 100, 3, categories[0], callback);
        },
        function(callback) {
            itemCreate('Wooden Shield', 'Defense: 5', 100, 3, categories[1], callback);
        },
        function(callback) {
            itemCreate('Iron helm', 'Defense: 3', 50, 3, categories[2], callback);
        },
        function(callback) {
            itemCreate('Chain mail', 'Defense: 10', 150, 3, categories[3], callback);
        },
        function(callback) {
            itemCreate('Potion', 'Heals 20HP', 20, 10, categories[4], callback);
        },
        
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});