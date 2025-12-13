// Simple script to add sample data
// Run with: node add-sample-data.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addSampleData() {
  console.log('🌱 Adding sample data to Firestore...');
  
  try {
    // Add categories
    const categories = [
      { name: 'Burgers', icon: '🍔', order: 1 },
      { name: 'Drinks', icon: '🥤', order: 2 },
      { name: 'Pasta', icon: '🍝', order: 3 },
      { name: 'Desserts', icon: '🍰', order: 4 },
    ];

    for (const cat of categories) {
      await db.collection('categories').add(cat);
      console.log(`✅ Added category: ${cat.name}`);
    }

    // Add menu items
    const menuItems = [
      {
        name: 'Truffle Burger',
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        description: 'Premium beef patty with black truffle sauce, aged cheddar, and brioche bun',
        ingredients: ['Beef patty', 'Black truffle', 'Aged cheddar', 'Brioche bun', 'Lettuce', 'Tomato'],
        category: 'burgers'
      },
      {
        name: 'Classic Cheeseburger',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
        description: 'Aged cheddar, lettuce, tomato on premium beef patty',
        ingredients: ['Beef patty', 'Aged cheddar', 'Lettuce', 'Tomato', 'Special sauce'],
        category: 'burgers'
      },
      {
        name: 'BBQ Bacon Burger',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433w=400',
        description: 'Beef patty with bacon, BBQ sauce, onion rings',
        ingredients: ['Beef patty', 'Bacon', 'BBQ sauce', 'Onion rings', 'Cheddar'],
        category: 'burgers'
      },
      {
        name: 'Craft Cocktail',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400',
        description: 'Signature cocktail with premium spirits and fresh ingredients',
        ingredients: ['Premium gin', 'Fresh citrus', 'Botanical syrup', 'Sparkling water'],
        category: 'drinks'
      },
      {
        name: 'Fresh Lemonade',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        description: 'Homemade with fresh lemons and natural sweeteners',
        ingredients: ['Fresh lemons', 'Pure cane sugar', 'Filtered water', 'Mint leaves'],
        category: 'drinks'
      }
    ];

    for (const item of menuItems) {
      await db.collection('menuItems').add(item);
      console.log(`✅ Added menu item: ${item.name}`);
    }

    console.log('🎉 Sample data added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

addSampleData();
