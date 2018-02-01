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
        "Quit",
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

         case "Quit":
          quit();
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

// function displays all products with under 200 units in stock
function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity <= 200", function (err, res) {
  if (err) throw err;
  console.log("\n===========LOW INVENTORY ITEMS (UNDER 200 UNITS)===========\n");
  console.table(res);
  managerCommands();  

  }) 
}

// function add to chosen product's inventory
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
      }
    ])
    .then(function(answer) {
      var qty = parseInt(answer.increaseBy);
      var item = answer.addStock -1;
      var current = parseInt(res[item].stock_quantity);
      var increase = current + qty;
      console.log(increase);
      connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {stock_quantity: increase},
                {item_id: answer.item}
              ],
              function(error) {
                if (error) throw err;
              }
            ); 
      console.log("\n" + res[item].product_name + "(s) inventory is updated to " + (current + qty) + "\n");
      
      managerCommands();
          
}); // end inquirer response
}); 
} // end function addInventory


function addNewProduct() {
     console.log("\n======================ADD NEW INVENTORY=======================\n");
     inquirer
    .prompt([
    {
      name: "newProduct",
      type: "input",
      message: "Name of new product?"
    },
    {
      name: "qty",
      type: "input",
      message: "What quantity should be added to inventory"
    },
    {
      name: "dept",
      type: "rawlist",
      message: "Which department:",
      choices: ["Sports & Outdoors", "Home Improvement", "Electronics"]
    },
    {
      name: "price",
      type: "input",
      message: "Price?"
    }
    ])
    .then(function(answer) {
      var insert = "INSERT INTO products SET ?, ?, ?, ?"
      connection.query(insert,
        [
          {product_name: answer.newProduct},
          {stock_quantity: answer.qty},
          {department_name: answer.dept},
          {price: answer.price}
        ],
      function(err, res){
        if (err) throw err;
        console.log(answer.newProduct + "(s) have been added to inventory");
        managerCommands();
      });

    });
};


function quit() {
   console.log("\nThank you. Come Again.");
   connection.end();
};