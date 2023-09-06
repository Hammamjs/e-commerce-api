const mongoose = require("mongoose");

const dataBase = () => {
  mongoose
    .connect(process.env.URI_DB)
    .then((conn) => console.log("Connection Done " + conn.connection.host));
};

module.exports = dataBase;
