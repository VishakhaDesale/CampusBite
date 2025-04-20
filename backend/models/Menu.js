const mongoose = require("mongoose");

const MenuSchema = mongoose.model("menuitem", new mongoose.Schema({
    day: String,
    breakfast: String,
    lunch: String,
    dinner: String
}));

// Get the weekly menu
// module.exports.getMenu = async function () {
//     const menuItems = await MenuSchema.find({})
//         .select({ _id: 0 });
//     return menuItems;
// }

module.exports.getMenu = async function () {
    const menuItems = await MenuSchema.find({})
        .select({ _id: 0 });

    const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    // Sort manually by day name
    menuItems.sort((a, b) => {
        return dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase());
    });

    return menuItems;
}


// Set the weekly menu
module.exports.setMenus = async function (menus) {
    await MenuSchema.deleteMany({});
    await MenuSchema.insertMany(menus);
}