const express = require('express');
const bodyparser =require('body-parser');
const mongoose = require('mongoose');

const { urlencoded } = require('express');

var item = '';
var items = [];
var workItems = [];

const app = express();

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/items',{useNewUrlParser:true, useUnifiedTopology:true});

const ItemSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item',ItemSchema);



app.get('/', function(req, res){

    var day = new Date();
    var nday = day.toLocaleDateString('en-US');

    Item.find({},function(err,found){
        console.log(found[0].name);
        res.render('list',{listTitle:'today is '+nday,newitems:found});
    });

    //console.log(set)
    
    //res.render('list',{listTitle:'today is '+nday,newitems:items});
});

app.post('/',function(req,res){
    item = req.body.listItem;
    console.log(item);
    if (req.body.list == 'work') {
        workItems.push(item);
        console.log(workItems);
        res.redirect('/work');
    }
    else{
        let itemTobeSaved = new Item({
            name : item
        })
        itemTobeSaved.save();

        items.push(item)
        res.redirect('/');
    }
    
    console.log(req.body);
});

app.post('/updateStatus',function (req,res) {
    console.log('inside the update status block');
    console.log(req.body);
})


//this is the work item section...
app.get('/work',function(req,res){
    res.render('list',{listTitle:'work',newitems:workItems})
});


app.post('/work',function(req,res){
    console.log('this is the post request to the work route ')
    console.log(req.body);

    let newitem = req.body.listItem;
    workItems.push(newitem);
});

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log('server running at port 3000 !!!');
})


