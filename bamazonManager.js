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
  for (var i = 0; i < res.length; i++) {
    console.log(res[i].item_id + "  " + res[i].product_name + "  " + "$" + parseFloat(res[i].price).toFixed(2));
  }
    managerCommands();
  }) 
}

function viewLowInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  console.log("\n===========LOW INVENTORY===========\n")
  for (var i = 0; i < res.length; i++) {
    if (res.stock_quantity < 5) {
      console.log(res[i].item_id + "  " + res[i].product_name);
    }
   }
     managerCommands();  
  }) 
}

function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  
  }) 
}

function addNewProduct() {
  connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  
  }) 
}