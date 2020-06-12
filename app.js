//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://saurav_kukreja:sauravkukreja123456@cluster0-ogjes.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema); //added

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to todo List"
});
const item2 = new Item({
  name: "click + to add an item"
});
const item3 = new Item({
  name: "<= check the button to delete item"
});


const defaultItems = [item1, item2, item3];

// List.findOne({
//   name: listName
// }, function(err, foundList) {
// if(!foundList){
// console.log(listName+"<<<<<<<<<<<<<>>>>>>>>>>>>>>>>");
//   List.find({}, function(err, foundItems) {
//     console.log(foundItems.items);
//   });
//     Item.find({}, function(err, foundItems) {
//       console.log(foundItems);
//
// });
// }
// });

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length == 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "TODAY",
        newListItems: foundItems
      });
    }
  });
});

app.get("/:newpage", function(req, res) {
  const customListName = _.capitalize(req.params.newpage);
  console.log(customListName);

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName)
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }

    }
  });

});

app.post("/", function(req, res) {

  const listName = req.body.listtitle;
  console.log("listname ==>" + listName);
  const itemName = req.body.newItem;
  console.log("itemname ==>" + itemName);
  const item = new Item({
    name: itemName
  });

  if (listName == "TODAY") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
          });
        // });
    }

});
    // List.findOne({
    //   name: listName
    // }, function(err, foundList) {
    //
    //     foundList.items.push(item);
    //     foundList.save();
    //     res.redirect("/" + listName);
    //
    // });




  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }


app.post("/delete", function(req, res) {
  const itemid = req.body.sauravkacheckbox;
  const listName = req.body.listName;
  console.log("listName===>"+listName);
  console.log("id===>"+itemid)
  if (listName == "TODAY"){
    Item.findByIdAndRemove(itemid, function(err) {
    if(!err){
      console.log("Successfully deleted item from TODAY list");
      res.redirect("/");
    }

    });
  }
  else{
    List.findOneAndUpdate({name : listName} , {$pull :{items : {_id : itemid}}}  , function(err , foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }

});


// app.get("/work", function(req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });
//
// app.get("/about", function(req, res) {
//   res.render("about");
// });
let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started ");
});
