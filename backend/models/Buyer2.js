const mongoose = require("mongoose");

const BuyerSchema = mongoose.model("buyer", new mongoose.Schema({
    email: String,
    secret: String,
    bought: Boolean,
    this: {
        monday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        tuesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        wednesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        thursday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        friday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        saturday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        sunday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        }
    },
    next: {
        monday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        tuesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        wednesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        thursday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        friday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        saturday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        sunday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        }
    }
}));

// Get the user details, or if it doesn't exists, create a new user object
module.exports.getBuyer = async function (email) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let randomStr = "";
    for (let i = 0; i < 4; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];

    const Buyer = await BuyerSchema.findOneAndUpdate(
        { email: email },
        {
            $setOnInsert: {
                bought: false,
                secret: randomStr,
                this: {
                    monday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    tuesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    wednesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    thursday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    friday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    saturday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    sunday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    }
                },
                next: {
                    monday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    tuesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    wednesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    thursday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    friday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    saturday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    sunday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    }
                }
            }
        },
        { new: true, upsert: true }
    ).select({ _id: 0 });
    return Buyer;
}

// Resets the user secret and returns the updated user object
module.exports.resetSecret = async function (email) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let randomStr = "";
    for (let i = 0; i < 4; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];

    const Buyer = await BuyerSchema.findOneAndUpdate(
        { email: email },
        { secret: randomStr }).select({ _id: 0 });
    return Buyer;
}

// Check if the user's coupon is valid for the current day and meal
// module.exports.checkCoupon = async function (data) {
//     console.log("Coupon is here!!", data.email);
//     const Buyer = await BuyerSchema.findOne({ email: data.email, secret: data.secret });
//     console.log("Coupon is here Buyer!!", Buyer);
//     console.log("Coupon is here Buyer!! this:", Buyer.this[data.day]);

//     if (Buyer == null) return false;
//     if (Buyer.this[data.day][data.type]) {
//         await BuyerSchema.updateOne({ email: data.email }, { ["this." + data.day + "." + data.type]: false });
//         console.log("true")
//         return true;
//     }
//     console.log("false")
//     return false;
// }

// Helper function to determine the current meal
function getCurrentMeal() {
    const now = new Date();
    const currentHour = now.getHours(); // Get the current hour (0-23)

    // Define time ranges for meals
    const mealTimes = {
        breakfast: { start: 6, end: 10 },   // Breakfast: 6 AM - 10 AM
        lunch: { start: 12, end: 14 },     // Lunch: 12 PM - 2 PM
        dinner: { start: 18, end: 24 }     // Dinner: 6 PM - 9 PM
    };

    // Determine the current meal
    for (const [meal, time] of Object.entries(mealTimes)) {
        if (currentHour >= time.start && currentHour < time.end) {
            return meal;
        }
    }
    return null; // If no meal time matches
}

// Check if the user's coupon is valid for the current day and meal
module.exports.checkCoupon = async function (data) {
    console.log("Coupon is here!!", data.email);

    // Get the current meal dynamically
    const currentMeal = getCurrentMeal();
    if (!currentMeal) {
        console.log("It's not meal time right now.");
        return false;
    }

    // Fetch the buyer's data
    const Buyer = await BuyerSchema.findOne({ email: data.email, secret: data.secret });
    console.log("Coupon is here Buyer!!", Buyer);

    if (Buyer == null) return false;

    // Check the coupon for the current meal
    if (Buyer.this[data.day][currentMeal]) {
        await BuyerSchema.updateOne(
            { email: data.email },
            { ["this." + data.day + "." + currentMeal]: false }
        );
        console.log("Coupon is valid for", currentMeal);
        return true;
    }

    console.log("Coupon is not valid for", currentMeal);
    return false;
};

// Save the purchased coupons after a successful payment
module.exports.saveOrder = async function (email, selectedMeals) {
    console.log("SelectedMeals:", selectedMeals);

    // Get the current meal dynamically
    const currentMeal = getCurrentMeal();
    if (!currentMeal) {
        console.log("It's not meal time right now.");
        return;
    }

    // Update the selected meals for the current meal
    await BuyerSchema.updateOne(
        { email: email },
        {
            $set: {
                ["this." + currentMeal]: selectedMeals[currentMeal],
                bought: true
            }
        },
        { upsert: true }
    );
};


// Save the purchased coupons after a successful payment
// module.exports.saveOrder = async function (email, selectedMeals) {
//     console.log("SelectedMeals:", selectedMeals)
//     await BuyerSchema.updateOne(
//         { email: email },
//         { 
//             $set: { 
//                 "this": selectedMeals,
//                 bought: true 
//             }
//         },
//         { upsert: true }
//     );
// }

// Check if the user has already bought the coupons for the coming week
module.exports.boughtNextWeek = async function (email) {
    await module.exports.getBuyer(email);

    const Buyer = await BuyerSchema.findOne({ email: email });

    return Buyer.bought;
}

// Returns details of all the users
module.exports.allBuyers = async function () {
    const Buyers = await BuyerSchema.find({});
    return Buyers;
}