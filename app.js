require('dotenv').config()
const express = require('express');
const bodyparser =require('body-parser');
const mongoose = require('mongoose');

const { urlencoded } = require('express');
const { name } = require('ejs');


var workItems = [];

const app = express();

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/items',{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false});


// This section defines the schemas for the mongoose documents
const ItemSchema = mongoose.Schema({
    name: String
});
const listSchema = mongoose.Schema({
    name : String,
    items : [ItemSchema]
})

const Item = mongoose.model('Item',ItemSchema);
const List = mongoose.model('List', listSchema);

const work = new List({
    
});

app.get('/', function(req, res){


    Item.find({},function(err,found){
        //console.log(found[0].name);
        res.render('list',{listTitle:'default', newitems:found});
    });

    //console.log(set)
    
    //res.render('list',{listTitle:'today is '+nday,newitems:items});
});

app.post('/',function(req,res){
    item = req.body.listItem;
    listName = req.body.list;

    if (listName == 'default') {
        let itemTobeSaved = new Item({
            name : item
        })
        itemTobeSaved.save();
        res.redirect('/');
    } else {
        //add the item to the specific list 
        let itemTobeSaved = new Item({
            name : item
        });
        List.findOne({name : listName},function name(err, foundList) {
            if (!err) {
                foundList.items.push(itemTobeSaved);
                foundList.save();
                res.redirect('/'+listName);
            } else {
                
            }
        })
    }
});

app.get('/:param',function (req, res) {
    let listName  = req.params.param;
    console.log('the list name is ',listName);

    List.findOne({name : listName},function (err,foundList) {
        if (!err) {
            console.log('no error...');
            if (!foundList) {
                console.log('no list found .... creating a new list...');
                const newlist = new List({
                    name : listName,
                    items : [
                        {name : 'first default item on the list'}
                    ]
                });
                console.log('list created with default item...');
                newlist.save(function(err){
                    if (!err) {
                        res.redirect('/'+listName);
                    }
                });
            } else {
                console.log('found');
                res.render('list',{listTitle: listName, newitems: foundList.items})
                //res.send('found');
                
            }
        }else{
            console.log(err);
        }
    })

    // List.exists({name:listName},function (err,bl){
    //     console.log(bl);
    //     console.log(!err);
        
    //     if (bl) {
    //         List.find({name: listName},function (err,foundList) {
    //             if (!err) {
    //                 console.log('list is found ... displaying the rendered list ')
    //                 res.render('list',{listTitle:listName, newitems:foundList.items});
    //             }
    //         })
             
    //     } else {
    //         console.log('no list found \n creating a new list...')
    //         const newList = new List({
    //             name : listName,
    //             items : [{name : 'first item of the above list'}]
    //         });
    //         newList.save();
    //         console.log('list created is : ' , newList)
    //         res.redirect('/'+listName);
    //     }
    // });
})

app.post('/delete',function (req,res) {
    console.log('inside the update status block');
    console.log(req.body.checkbox);
    console.log(req.body.listName);

    const listName = req.body.listName;
    const itemtoDelete = req.body.checkbox;
    if (listName == "default") {
        
        Item.findByIdAndDelete(itemtoDelete, function (err) {
        if (err) {
            console.log(err);
        }else{
            console.log('item deleted...');
            res.redirect('/');
        }
    });
    } else {
        List.findOneAndUpdate({name : listName}, {$pull:{items :{_id : itemtoDelete}}}, function(err,foundlist){
            if (!err) {
                //console.log(foundList);
                res.redirect('/'+listName);
            }
        });  
    }

})


app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log('server running at port 3000 !!!');
})


