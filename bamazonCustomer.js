var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Swampy33",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  displayProducts();
});

// function which prompts the user for what action they should take
function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  for (var i = 0; i < res.length; i++) {
    console.log(res[i].item_id + "  " + res[i].product_name + "  " + "$" + parseFloat(res[i].price).toFixed(2) );
  }
    connection.end(); 
    makePurchase();
  }) 
}

// function which prompts the user for what action they should take
function makePurchase() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "productId",
        type: "input",
        message: "What is the ID of the product you'd like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantityOfItem",
        type: "input",
        message: "How many units would you like?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
     ])
    .then(function(answer) {

      //var itemSelected = answer.productId;
      connection.query("SELECT stock_quantity FROM products WHERE item_id = answer.productId", function (err, res) {
        console.log(answer.productId);
       //if (err) throw err;
       var currentStock = res.stock_quantity;
       var quantityWanted = res.quantityOfItem;

       if (currentStock < quantityWanted) {
          console.log("Insufficient quantity! Choose another item?")
          displayProducts();
       }else {
         console.log("Placing your order...\n");
         currentStock-=quantityWanted;
         connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: currentStock
              },
              {
                item_id: answer.productId
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed!");
              displayProducts();
            }
          ); 
       }
       

       //deductFromStock(itemSelected);
       //connection.end(); 
       //displayProducts();
       }) //end query

    });
}

//var deductFromStock = function() {
  //console.log("function deductFromStock");
  // var query = connection.query(
  //   "UPDATE products SET ? WHERE ?",
  //   [
  //     {
  //       quantity: 100
  //     },
  //     {
  //       flavor: "Rocky Road"
  //     }
  //   ],
  //   function(err, res) {
  //     console.log(res.affectedRows + " products updated!\n");
  //     // Call deleteProduct AFTER the UPDATE completes
  //     deleteProduct();
  //   }
  //);
//}