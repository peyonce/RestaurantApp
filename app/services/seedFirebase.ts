import { db } from '../config/firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Create sample menu items
export const seedMenuItems = async () => {
  try {
    const menuItems = [
      {
        name: "Chicken Burger",
        description: "Juicy grilled chicken with lettuce and mayo",
        price: 65.99,
        category: "Burgers",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
      },
      {
        name: "Beef Burger",
        description: "Classic beef patty with cheese and pickles",
        price: 75.99,
        category: "Burgers",
        imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330"
      },
      {
        name: "Pizza Margherita",
        description: "Classic tomato, mozzarella and basil",
        price: 89.99,
        category: "Pizza",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
      },
      {
        name: "French Fries",
        description: "Crispy golden fries with seasoning",
        price: 29.99,
        category: "Sides",
        imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f"
      },
      {
        name: "Coca Cola",
        description: "Ice cold 500ml bottle",
        price: 19.99,
        category: "Drinks",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
      }
    ];

    const menuRef = collection(db, 'menuItems');
    for (const item of menuItems) {
      await addDoc(menuRef, item);
    }
    console.log('Menu items seeded!');
  } catch (error) {
    console.error('Error seeding menu:', error);
  }
};

// Initialize collections structure
export const initializeCollections = async () => {
  try {
    // Create empty collections if they don't exist
    const collections = ['menuItems', 'orders', 'carts', 'users'];
    
    for (const collectionName of collections) {
      const ref = collection(db, collectionName);
      // Just creating a reference ensures collection exists
      console.log(`Initialized ${collectionName} collection`);
    }
    
    console.log('All collections initialized!');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};
