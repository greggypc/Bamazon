const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  // run the displayProducts function after the connection is made to prompt the user
  displayProducts();
});

// function displays product to purchase
function displayProducts() {
  connection.query("SELECT item_id, product_name, price FROM products", (err, res) => {
  if (err) throw err;
  console.log("\n");
  console.table(res);
  
  makePurchase();
  }) 
}

// function lets user choose product and quantity for purchase
function makePurchase() {
  //console.log("\n");
  inquirer
    .prompt([
      {
        name: "productId",
        type: "input",
        message: "What is the ID of the product you'd like to buy?",
        validate(value) {
          if (isNaN(value) === false) {return true;
          } return false;
        }
      },
      {
        name: "quantityOfItem",
        type: "input",
        message: "How many units would you like?",
        validate(value) {
         if (isNaN(value) === false) {return true;
          } return false;

        }
      }
     ])
    .then(answer => {

      const query = "SELECT stock_quantity, price FROM products WHERE ?";
      connection.query(query, { item_id: answer.productId }, (err, res) => {
       if (err) throw err;

       //does the item_id exist?
       if (!res[0]) {
        console.log("\nProduct does not exist - choose another:\n" + "========================================\n");
        displayProducts();
        return;
      }

        for (let i = 0; i < res.length; i++) {
          let currentStock = res[i].stock_quantity;
          const productCost = res[i].price;
          const quantityWanted = answer.quantityOfItem;
          
          if (currentStock < quantityWanted) {
          console.log("Insufficient quantity! Choose another item?")
          displayProducts();
         }else {
           console.log("Placing your order...\n");
           currentStock -= quantityWanted;
           connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {stock_quantity: currentStock},
                {item_id: answer.productId}
              ],
              error => {
                if (error) throw err;
              }

            ); 
            console.log("Order placed!");
            console.log(`Order total: $${parseFloat(productCost * quantityWanted).toFixed(2)}` );

            //ask user to continue or end
            buyAgain();
         }
        }

      }) //end query
}); // end inquirer response
}

//ask user to continue or end
function buyAgain() {
  console.log("\n");
  inquirer
    .prompt([
      {
        name: "buy",
        type: "confirm",
        message: "Make another purchase?",
      }
    ])
    .then(answer => {
      if (answer.buy) {
        console.log("\nGreat! Choose another product:");
        displayProducts();
      } else {
        console.log("\nThank you. Come Again.");
        connection.end();
      }
}); // end inquirer response
}