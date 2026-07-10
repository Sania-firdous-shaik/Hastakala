const mongoose = require("mongoose");
const Category = require("./models/Category");

mongoose.connect("mongodb://localhost:27017/craft-marketplace")
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
