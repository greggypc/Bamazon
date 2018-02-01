var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the displayProducts function after the connection is made to prompt the user
  displayProducts();
});

// function displays product to purchase
function displayProducts() {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
  if (err) throw err;
  console.table(res);
  
  makePurchase();
  }) 
}

// function lets user choose product and quantity for purchase
function makePurchase() {
  console.log("\n");
  inquirer
    .prompt([
      {
        name: "productId",
        type: "input",
        message: "What is the ID of the product you'd like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {return true;
          } return false;
        }
      },
      {
        name: "quantityOfItem",
        type: "input",
        message: "How many units would you like?",
        validate: function(value) {
         if (isNaN(value) === false) {return true;
          } return false;

        }
      }
     ])
    .then(function(answer) {

      //var itemSelected = answer.productId;
     // console.log(answer.productId);
      var query = "SELECT stock_quantity, price FROM products WHERE ?";
      connection.query(query, { item_id: answer.productId }, function(err, res) {
       if (err) throw err;

       //does the item_id exist?
       if (!res[0]) {
        console.log("\nProduct does not exist - choose another:\n" + "========================================\n");
        displayProducts();
        return;
      }
       
       //console.log(res);

        for (var i = 0; i < res.length; i++) {
          var currentStock = res[i].stock_quantity;
          var productCost = res[i].price;
          var quantityWanted = answer.quantityOfItem;
          
          if (currentStock < quantityWanted) {
          console.log("Insufficient quantity! Choose another item?")
          displayProducts();
         }else {
           console.log("Placing your order...\n");
           currentStock -= quantityWanted;
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
              }

            ); 
            console.log("Order placed!");
            console.log("Order total: $" +  parseFloat(productCost * quantityWanted).toFixed(2) );
                //return;
                displayProducts();
         }
        }

      }) //end query
}); // end inquirer response
}; // end function makePurchase
