var express = require("express");
const { MongoClient } = require("mongodb");
var app = express();
const cors = require("cors");
app.use(cors());

var db;

// Establish a Connection with MongoDB.
MongoClient.connect("mongodb+srv://maaz:root@mymongocluster.l5zkr.mongodb.net/dashboard",
    function (err, database) {
        if (err) throw err;
        else {
            db = database;
            console.log("Connected to MongoDB");
        }
    }
);

// Running the Backend Server using Express
app.listen(5000, () => console.log("Running on port 5000"));

// Get the Datas of all the fields with and without any filters.
app.post("/getDatas", async (req, res) => {
    let keyName = [
        "$intensity",
        "$likelihood",
        "$relevance",
        "$end_year",
        "$country",
        "$topic",
        "$region",
    ];
    let { field, filter } = req.query;
    let collectionDetails = [];
    // Check if the user has not sent any filter request.
    if (filter === "" && field === "") {
        // Iterate the MongoDB and store the values of each field into collectionDetails Array.
        for (let i = 0; i < keyName.length; i++) {
            // Group the Collection based on their keyname and the count of each value appeared for that key.
            let listCollections = await db
                .db("dashboard")
                .collection("details")
                .aggregate([
                    { $group: { _id: [keyName[i]], count: { $sum: 1 } } },
                ])
                .toArray();
            collectionDetails.push(listCollections);
        }
    }
    // Check if there is any filter available.
    else {
        field = field.toLowerCase();
        // Check if the filter is a number convert it to integer
        if (parseInt(filter)) {
            filter = parseInt(filter);
        }
        // If field is year change the field name to end_year
        if (field == "year")
            field = "end_year";

        // Iterate the MongoDB and store the values of each field into collectionDetails Array.
        for (let i = 0; i < keyName.length; i++) {
            // Group the Collection based on their keyname and the count of each value appeared for that key and match the field with its filter.
            let listCollections = await db
                .db("dashboard")
                .collection("details")
                .aggregate([
                    {$match:{ [field] : filter }},{ $group: { _id: [keyName[i]], count: { $sum: 1 } }, },
                ])
                .toArray();
            collectionDetails.push(listCollections);
        }
    }
    // Send the finally modified Array of Values to Front End.
    res.send(collectionDetails);
});

// Get all the filters for each field that exists.
app.get("/getFilters", async (req, res) => {
    let keyName = [
        "end_year",
        "topic",
        "sector",
        "region",
        "pestle",
        "source",
        "country",
        "relevance"
    ];
    let filterDetails = [];
    // Iterate the MongoDB and store the values of filters available under each field into filterDetails Array.
    for (let i = 0; i < keyName.length; i++) {
        let listFilters = await db
            .db("dashboard")
            .collection("details")
            .distinct(keyName[i]);
        filterDetails.push(listFilters);
    }
    //  Send the finally modified Array of Values to Front End.
    res.send(filterDetails);
});
