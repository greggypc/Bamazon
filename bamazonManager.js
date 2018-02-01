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
  managerCommands();
});

var managerCommands = function() {
  inquirer
    .prompt({
      name: "action",

      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View products for sale",
        "View low inventory",
        "Add to inventory",
        "Add new product",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View products for sale":
          viewAllProducts();
          break;

        case "View low inventory":
          viewLowInventory();
          break;

        case "Add to inventory":
          addInventory();
          break;

        case "Add new product":
          addNewProduct();
          break;

       default:
          console.log("not an option");
          
      }
    });
}

// function displays all available products
function viewAllProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  console.log("\n======================FULL INVENTORY=======================\n");
  console.table(res);
  
  managerCommands();
  }) 
}

function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity <= 200", function (err, res) {
  if (err) throw err;
  console.log("\n===========LOW INVENTORY ITEMS (UNDER 200 UNITS)===========\n");
  console.table(res);
  managerCommands();  

  }) 
}

function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  console.log("\n======================ADD INVENTORY=======================\n");
  console.table(res);
  inquirer
    .prompt([
      {
        name: "addStock",
        type: "input",
        message: "Increase stock of which Item Id?",
      },
      {
        name: "increaseBy",
        type: "input",
        message: "Increase stock by how much?",
      },
    ])
    .then(function(answer) {
      // var addStock = parseInt(answer.addStock);
      // var increaseBy = parseInt(answer.increaseBy);
      // var newStock = 0;
      // var productName;
      // var currentStock;
      var newStock = currentStock + increaseBy;

        var query = "SELECT stock_quantity, product_name FROM products WHERE ?";
        connection.query(query, { item_id: addStock }, function(err, res) {
         
      //does the item_id exist?
       if (!res[0]) {
        console.log("\nProduct does not exist - choose another:\n" + "========================================\n");
        addInventory();
        return;
      };
          currentStock = parseInt(res[0].stock_quantity);
          newStock = currentStock + increaseBy;
          console.log(newStock);
          productName = res[0].product_name;
           console.log(productName);
        });

          connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newStock
                },
                {
                  item_id: answer.productId
                }
              ],
              function(error) {
                if (error) throw err;
              }

            ); 
          console.log("\nInventory for " + productName + " has been updated to " + newStock);
          managerCommands(); 
}); // end inquirer response
}; // end function addInventory

function addNewProduct() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  
  }) 
}