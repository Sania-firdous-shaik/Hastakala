const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log("MongoDB connected");

    await Category.deleteMany({});

    const categories = await Category.insertMany([
        {
            name: "Handicrafts",
            description: "Traditional handmade crafts"
        },
        {
            name: "Jewelry",
            description: "Handmade jewelry and accessories"
        },
        {
            name: "Home Decor",
            description: "Beautiful handmade home decoration items"
        },
        {
            name: "Wood Crafts",
            description: "Handcrafted wooden products"
        },
        {
            name: "Paintings",
            description: "Traditional artwork and paintings"
        }
    ]);

    console.log("Categories added:");
    console.log(categories);

    mongoose.connection.close();
})
.catch(err => console.log(err));
