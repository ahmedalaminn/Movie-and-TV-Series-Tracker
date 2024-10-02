const mongoose = require("mongoose");
mongoose.set('strictQuery', false); // Optional, depending on your query preferences

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    // Log the connection string for debugging
    console.log("Database Connection String: ", process.env.DB);

    // Using a Promise to handle connection and catch errors
    mongoose.connect(process.env.DB, connectionParams)
        .then(() => {
            console.log("Connected to database successfully");
        })
        .catch(error => {
            console.error("Could not connect to database:", error);
        });
};
