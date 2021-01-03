const express = require('express');
const bodyparser =require('body-parser');
//const ejs = require('ejs');

var item = '';
var items = [];
var workItems = [];

const app = express();

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

app.get('/', function(req, res){

    var day = new Date();
    var nday = day.toLocaleDateString('en-US');
    
    res.render('list',{listTitle:'today is '+nday,newitems:items});
});

app.post('/',function(req,res){
    item = req.body.listItem;
    if (req.body.list == 'work') {
        workItems.push(item);
        res.redirect('/work');
    }
    else{
        items.push(item)
        res.redirect('/');
    }
    
    console.log(req.body);
});

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


