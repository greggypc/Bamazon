const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  // run the managerCommands function after the connection is made to prompt the user
  managerCommands();
});

var managerCommands = () => {
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
    .then(answer => {
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
  connection.query("SELECT * FROM products", (err, res) => {
  if (err) throw err;
  console.log("\n======================FULL INVENTORY=======================\n");
  console.table(res);
  managerCommands();
  }) 
}

// function displays all products with fewer than 200 units in stock
function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 200", (err, res) => {
  if (err) throw err;
  console.log("\n===========LOW INVENTORY ITEMS (UNDER 200 UNITS)===========\n");
  console.table(res);
  managerCommands();  
  }) 
}

// function add to chosen product's inventory
function addInventory() {
  connection.query("SELECT * FROM products", (err, res) => {
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
    .then(answer => {
      const qty = parseInt(answer.increaseBy);
      const item = answer.addStock -1;
      const current = parseInt(res[item].stock_quantity);
      const increase = current + qty;
      //console.log(increase);
      connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {stock_quantity: increase},
                {item_id: answer.addStock}
              ],
              error => {
                if (error) throw err;
              }
            ); 
      console.log(`\n${res[item].product_name} inventory is updated to ${current + qty}\n`);
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
    .then(answer => {
      const insert = "INSERT INTO products SET ?, ?, ?, ?";
      connection.query(insert,
        [
          {product_name: answer.newProduct},
          {stock_quantity: answer.qty},
          {department_name: answer.dept},
          {price: answer.price}
        ],
      (err, res) => {
        if (err) throw err;
        console.log(`${answer.newProduct}(s) have been added to inventory`);
        managerCommands();
      });

    });
}


function quit() {
   console.log("\nGreat job managing inventory! Bye.");
   connection.end();
}