
const express = require('express');

const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js");

const _ = require("lodash");

//DB
const mongoose = require("mongoose");

const app = express();
//This tell our app which is generated using Express to use EJS as it's view engine.
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));                            //must be typed below app = express(); app decllared and then used


app.use(express.static("public"));

//connecting to mongoose on url 27017 where it is hosted
mongoose.connect("mongodb+srv://admin-ab:test123@cluster0-ittji.mongodb.net/todolistDB",  {useUnifiedTopology: true, useNewUrlParser: true});

//Creating a Schema for items in the tidolistDB
const itemsSchema = {
  name: String
};

//new mongoose model(collection) based on the schema. Mongoose model name is capitalized.
const Item = mongoose.model("Item",itemsSchema);

//Binding values into DB as documents
const item1 = new Item({
  name: "Welcome!!"
});

const item2 = new Item({
  name: "Hit the + button to add!"
});

const item3 = new Item({
  name: "<--- Hit to delete!"
});

//Aray of items(documents)
const defaultItems = [item1,item2, item3];

//Making a new schema for Custom List
const listschema = {
  name: String,
  items: [itemsSchema]
};

//new mongoose model(collection) based on the schema. Mongoose model name is capitalized.
const List = mongoose.model("List",listschema);

app.get("/", function(req, res){
  //Finding and logging all the db values in foundItems. Rendering foundItems to "/" usinf list variable NewListItems
  Item.find({}, function(err, foundItems){

    if(foundItems.length ===0){
      //Inserting the default values into the list if the db is empty:
        Item.insertMany(defaultItems, function(err){
          if(err){
            console.log(err);
          } else {
            console.log("successfully inserted default items to db");
          }
        });
      res.redirect("/");
    } else {
      res.render("list", {ListTitle: "Today", NewListItems:  foundItems});
    }
  });
});
   //uses the view engine to render a particular page.

app.post("/", function(req, res){

     const itemName = req.body.Newitem;
     const listName = req.body.List;

     const item = new Item({
       name: itemName
     });

     if(listName === "Today"){
       item.save();
       res.redirect("/");
     } else {
       List.findOne({name: listName}, function(err, foundList){
         if(!err){
           foundList.items.push(item);
           foundList.save();
           res.redirect("/"+ listName);
         }
       });
     }

  });

app.post("/delete", function(req, res){
  let deltedItemId = req.body.checkbox;
  let listName = req.body.ListTitle;

  if(listName === "Today"){
    Item.findByIdAndRemove(deltedItemId, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("successfully Deleted item from the db!!");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull:{items:{_id: deltedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    })

  }

});

app.get("/:customListName", function(req, res){
  let customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", {ListTitle: foundList.name, NewListItems: foundList.items} )
      }
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});


app.listen(3000,function(req, res){
  console.log("The server is runnng on port 3000...");
});







// var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
// var day = days[today.getDay()];
// if(currentDay === 6|| currentDay ===0){
//   day = "weekend";
// } else {
//   day = "weekday";
// }
