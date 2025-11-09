import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import MenuItem from "./models/MenuItem.js";

dotenv.config();

const restaurants = [
  {
    name: "Bella Italia",
    description: "Authentic Italian cuisine with homemade pasta and wood-fired pizzas",
    cuisineTypes: ["Italian", "Pizza", "Pasta"],
    coverImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    logoUrl: "https://via.placeholder.com/100",
    location: {
      address: "456 Pizza Lane, San Francisco, CA 94103",
      coordinates: { type: "Point", coordinates: [-122.4194, 37.7749] },
    },
    contact: { phone: "+1 (415) 555-1234", email: "hello@bellaitalia.com" },
    operatingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    deliveryFee: 2.99,
    minimumOrder: 15,
    averageRating: 4.7,
    totalReviews: 1245,
    estimatedTimeMinutes: 35,
    priceRange: "$$",
    isActive: true,
    promotions: [{ badgeText: "Free Delivery" }],
  },
  {
    name: "Sushi Master",
    description: "Fresh sushi and Japanese delicacies made daily by expert chefs",
    cuisineTypes: ["Japanese", "Sushi", "Asian"],
    coverImageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
    logoUrl: "https://via.placeholder.com/100",
    location: {
      address: "789 Sushi Street, San Francisco, CA 94104",
      coordinates: { type: "Point", coordinates: [-122.4094, 37.7849] },
    },
    contact: { phone: "+1 (415) 555-5678", email: "info@sushimaster.com" },
    operatingHours: {
      monday: "12:00 PM - 10:00 PM",
      tuesday: "12:00 PM - 10:00 PM",
      wednesday: "12:00 PM - 10:00 PM",
      thursday: "12:00 PM - 10:00 PM",
      friday: "12:00 PM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "Closed",
    },
    deliveryFee: 3.99,
    minimumOrder: 20,
    averageRating: 4.9,
    totalReviews: 892,
    estimatedTimeMinutes: 40,
    priceRange: "$$$",
    isActive: true,
    promotions: [],
  },
  {
    name: "Burger House",
    description: "Gourmet burgers and shakes made with premium ingredients",
    cuisineTypes: ["American", "Burgers", "Fast Food"],
    coverImageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    logoUrl: "https://via.placeholder.com/100",
    location: {
      address: "123 Burger Ave, San Francisco, CA 94105",
      coordinates: { type: "Point", coordinates: [-122.3994, 37.7949] },
    },
    contact: { phone: "+1 (415) 555-9012", email: "orders@burgerhouse.com" },
    operatingHours: {
      monday: "10:00 AM - 11:00 PM",
      tuesday: "10:00 AM - 11:00 PM",
      wednesday: "10:00 AM - 11:00 PM",
      thursday: "10:00 AM - 11:00 PM",
      friday: "10:00 AM - 12:00 AM",
      saturday: "10:00 AM - 12:00 AM",
      sunday: "10:00 AM - 10:00 PM",
    },
    deliveryFee: 0,
    minimumOrder: 10,
    averageRating: 4.5,
    totalReviews: 2103,
    estimatedTimeMinutes: 25,
    priceRange: "$$",
    isActive: true,
    promotions: [{ badgeText: "Free Delivery" }],
  },
];

const menuItems = [
  // Bella Italia items
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
    price: 14.99,
    category: "Pizza",
    images: ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002"],
    dietaryTags: ["Vegetarian"],
    preparationTimeMinutes: 20,
    isAvailable: true,
    isPopular: true,
    customizationOptions: [
      {
        name: "Size",
        required: true,
        maxSelections: 1,
        options: [
          { label: "Small (10\")", priceDiff: 0 },
          { label: "Medium (12\")", priceDiff: 3 },
          { label: "Large (14\")", priceDiff: 6 },
        ],
      },
      {
        name: "Extra Toppings",
        required: false,
        maxSelections: 5,
        options: [
          { label: "Mushrooms", priceDiff: 1.5 },
          { label: "Pepperoni", priceDiff: 2 },
          { label: "Olives", priceDiff: 1 },
          { label: "Extra Cheese", priceDiff: 2 },
        ],
      },
    ],
  },
  {
    name: "Fettuccine Alfredo",
    description: "Creamy pasta with parmesan cheese and butter",
    price: 16.99,
    category: "Pasta",
    images: ["https://images.unsplash.com/photo-1645112411341-6c4fd023714a"],
    dietaryTags: ["Vegetarian"],
    preparationTimeMinutes: 18,
    isAvailable: true,
    isPopular: false,
  },
  // Sushi Master items
  {
    name: "California Roll",
    description: "Crab, avocado, and cucumber rolled in seaweed and rice",
    price: 12.99,
    category: "Rolls",
    images: ["https://images.unsplash.com/photo-1579584425555-c3ce17fd4351"],
    dietaryTags: [],
    preparationTimeMinutes: 15,
    isAvailable: true,
    isPopular: true,
  },
  {
    name: "Spicy Tuna Roll",
    description: "Fresh tuna with spicy mayo and cucumber",
    price: 14.99,
    category: "Rolls",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56"],
    spiceLevel: "hot",
    dietaryTags: [],
    preparationTimeMinutes: 15,
    isAvailable: true,
    isPopular: true,
  },
  // Burger House items
  {
    name: "Classic Cheeseburger",
    description: "Angus beef patty with cheddar, lettuce, tomato, and special sauce",
    price: 11.99,
    category: "Burgers",
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd"],
    dietaryTags: [],
    preparationTimeMinutes: 12,
    isAvailable: true,
    isPopular: true,
    customizationOptions: [
      {
        name: "Cook Temperature",
        required: true,
        maxSelections: 1,
        options: [
          { label: "Rare", priceDiff: 0 },
          { label: "Medium Rare", priceDiff: 0 },
          { label: "Medium", priceDiff: 0 },
          { label: "Well Done", priceDiff: 0 },
        ],
      },
    ],
  },
  {
    name: "Bacon Burger",
    description: "Double patty with crispy bacon, cheese, and BBQ sauce",
    price: 14.99,
    category: "Burgers",
    images: ["https://images.unsplash.com/photo-1550547660-d9450f859349"],
    dietaryTags: [],
    preparationTimeMinutes: 15,
    isAvailable: true,
    isPopular: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log("Cleared existing data");

    // Insert restaurants
    const insertedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`Inserted ${insertedRestaurants.length} restaurants`);

    // Link menu items to restaurants
    const bellaItaliaId = insertedRestaurants[0]._id;
    const sushiMasterId = insertedRestaurants[1]._id;
    const burgerHouseId = insertedRestaurants[2]._id;

    menuItems[0].restaurant = bellaItaliaId;
    menuItems[1].restaurant = bellaItaliaId;
    menuItems[2].restaurant = sushiMasterId;
    menuItems[3].restaurant = sushiMasterId;
    menuItems[4].restaurant = burgerHouseId;
    menuItems[5].restaurant = burgerHouseId;

    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log(`Inserted ${insertedItems.length} menu items`);

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();