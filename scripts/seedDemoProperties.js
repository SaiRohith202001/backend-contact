const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Property = require("../models/propertyModel");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const demoOwnerId = new mongoose.Types.ObjectId("66c222222222222222222222");

const demoProperties = [
  {
    ownerName: "Amit Verma",
    ownersContactNumber: "9876543210",
    ownersAlternateContactNumber: "9123456780",
    locality: "Gomti Nagar",
    address: "D-120, Vipul Khand, Gomti Nagar, Lucknow",
    spaceType: "Residential",
    propertyType: "Flat",
    currentResidenceOfOwner: "Same City",
    rent: 18500,
    concession: true,
    petsAllowed: true,
    preference: "Family",
    bachelors: "Others",
    type: "Semi-Furnished",
    bhk: 2,
    floor: 3,
    nearestLandmark: "Near Patrakarpuram Chauraha",
    typeOfWashroom: "Western",
    coolingFacility: "AC",
    carParking: true,
    subscriptionAmount: 999,
    commentByAnalyst: "Good for small families and working professionals.",
    locationLink: "https://maps.google.com/?q=26.8506,80.9926",
    photos: [
      "https://picsum.photos/seed/tolet-flat-1a/1200/800",
      "https://picsum.photos/seed/tolet-flat-1b/1200/800",
      "https://picsum.photos/seed/tolet-flat-1c/1200/800",
      "https://picsum.photos/seed/tolet-flat-1d/1200/800",
      "https://picsum.photos/seed/tolet-flat-1e/1200/800",
    ],
  },
  {
    ownerName: "Neha Singh",
    ownersContactNumber: "9988776655",
    ownersAlternateContactNumber: "9988776644",
    locality: "Aliganj",
    address: "B-42, Sector L, Aliganj, Lucknow",
    spaceType: "Residential",
    propertyType: "House",
    currentResidenceOfOwner: "Different City",
    rent: 26500,
    concession: false,
    petsAllowed: false,
    preference: "Family",
    bachelors: "Others",
    type: "Fully-Furnished",
    bhk: 3,
    floor: 2,
    nearestLandmark: "Near Kendriya Bhawan",
    typeOfWashroom: "Both",
    coolingFacility: "AC",
    carParking: true,
    subscriptionAmount: 1499,
    commentByAnalyst: "Spacious independent house in a prime neighborhood.",
    locationLink: "https://maps.google.com/?q=26.8842,80.9462",
    photos: [
      "https://picsum.photos/seed/tolet-house-2a/1200/800",
      "https://picsum.photos/seed/tolet-house-2b/1200/800",
      "https://picsum.photos/seed/tolet-house-2c/1200/800",
      "https://picsum.photos/seed/tolet-house-2d/1200/800",
      "https://picsum.photos/seed/tolet-house-2e/1200/800",
    ],
  },
  {
    ownerName: "Rahul Mishra",
    ownersContactNumber: "9311223344",
    ownersAlternateContactNumber: "",
    locality: "Indira Nagar",
    address: "A-17, Takrohi Market Road, Indira Nagar, Lucknow",
    spaceType: "Residential",
    propertyType: "PG",
    currentResidenceOfOwner: "Same Place",
    rent: 8500,
    concession: true,
    petsAllowed: false,
    preference: "Bachelors",
    bachelors: "Male",
    type: "Non-Furnished",
    bhk: 1,
    floor: 1,
    nearestLandmark: "Near Munshipulia Metro Station",
    typeOfWashroom: "Western",
    coolingFacility: "Fan",
    carParking: false,
    subscriptionAmount: 499,
    commentByAnalyst: "Budget PG option close to metro connectivity.",
    locationLink: "https://maps.google.com/?q=26.8869,81.0129",
    photos: [
      "https://picsum.photos/seed/tolet-pg-3a/1200/800",
      "https://picsum.photos/seed/tolet-pg-3b/1200/800",
      "https://picsum.photos/seed/tolet-pg-3c/1200/800",
      "https://picsum.photos/seed/tolet-pg-3d/1200/800",
      "https://picsum.photos/seed/tolet-pg-3e/1200/800",
    ],
  },
  {
    ownerName: "Sana Khan",
    ownersContactNumber: "9455001122",
    ownersAlternateContactNumber: "9455002211",
    locality: "Hazratganj",
    address: "Shop 12, Plaza Complex, Hazratganj, Lucknow",
    spaceType: "Commercial",
    propertyType: "Shop",
    currentResidenceOfOwner: "Same City",
    rent: 42000,
    concession: false,
    petsAllowed: false,
    preference: "Any",
    bachelors: "Others",
    type: "Semi-Furnished",
    bhk: 1,
    floor: 0,
    nearestLandmark: "Near Hazratganj Metro Station",
    typeOfWashroom: "Western",
    coolingFacility: "AC",
    carParking: true,
    subscriptionAmount: 1999,
    commentByAnalyst: "Suitable for boutique retail or office studio use.",
    locationLink: "https://maps.google.com/?q=26.8504,80.9471",
    photos: [
      "https://picsum.photos/seed/tolet-shop-4a/1200/800",
      "https://picsum.photos/seed/tolet-shop-4b/1200/800",
      "https://picsum.photos/seed/tolet-shop-4c/1200/800",
      "https://picsum.photos/seed/tolet-shop-4d/1200/800",
      "https://picsum.photos/seed/tolet-shop-4e/1200/800",
    ],
  },
];

async function seedDemoProperties() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to seed demo properties.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const operations = demoProperties.map((property) => ({
    updateOne: {
      filter: { address: property.address },
      update: {
        $set: {
          ...property,
          userId: demoOwnerId,
        },
      },
      upsert: true,
    },
  }));

  const result = await Property.bulkWrite(operations);
  const totalCount = await Property.countDocuments();

  console.log(
    JSON.stringify(
      {
        acknowledged: result.isOk(),
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        totalCount,
      },
      null,
      2
    )
  );
}

seedDemoProperties()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
