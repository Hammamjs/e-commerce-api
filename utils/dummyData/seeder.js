const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const Product = require("../../Model/productModel");
const dbConnection = require("../../DataBase/db");

dotenv.config({ path: "../../config.env" });

// Read data
const products = JSON.parse(fs.readFileSync("./product.json"));

// connect to DB
dbConnection();

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
