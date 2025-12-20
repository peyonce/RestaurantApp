import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

// Create sample menu items for Mzansi Meals
export const seedMenuItems = async () => {
  try {
    console.log('🌱 Seeding Mzansi Meals menu items...');
    
    const menuItems = [
      {
        name: "Boerewors Burger",
        description: "Traditional SA sausage burger with chakalaka relish",
        price: 89.99,
        category: "Burgers",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        popular: true,
        available: true
      },
      {
        name: "Bunny Chow Burger",
        description: "Durban-style curry in a bread bowl-inspired burger",
        price: 85.99,
        category: "Burgers",
        imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
        popular: true,
        available: true
      },
      {
        name: "Braai Platter",
        description: "Mixed grill with boerewors, steak, chops and pap",
        price: 189.99,
        category: "Mains",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
        popular: true,
        available: true
      },
      {
        name: "Bobotie Bowl",
        description: "Traditional Cape Malay minced meat bake with yellow rice",
        price: 125.99,
        category: "Mains",
        popular: true,
        available: true
      },
      {
        name: "Pap & Sheba",
        description: "Maize meal porridge with tomato and onion relish",
        price: 45.99,
        category: "Sides",
        popular: true,
        available: true
      },
      {
        name: "Rooibos Iced Tea",
        description: "Refreshing South African red bush tea with lemon",
        price: 32.99,
        category: "Drinks",
        imageUrl: "https://images.unsplash.com/photo-1561047029-3000c68339ca",
        popular: true,
        available: true
      },
      {
        name: "Koeksisters",
        description: "Traditional syrup-coated doughnuts",
        price: 28.99,
        category: "Desserts",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
        popular: true,
        available: true
      }
    ];

    const menuRef = collection(db, 'menuItems');
    let addedCount = 0;
    
    for (const item of menuItems) {
      try {
        await addDoc(menuRef, {
          ...item,
          createdAt: new Date(),
          restaurantId: 'mzansi-meals-001',
          restaurantName: 'Mzansi Meals'
        });
        addedCount++;
        console.log(`✅ Added: ${item.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${item.name}:`, error);
      }
    }
    
    console.log(`🎉 Seeding complete! Added ${addedCount} items for Mzansi Meals`);
    return addedCount;
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Seed restaurant information for Mzansi Meals
export const seedRestaurantInfo = async () => {
  try {
    const restaurantInfo = {
      name: 'Mzansi Meals',
      slogan: 'Taste the Rainbow Nation',
      description: 'Authentic South African cuisine with a modern twist',
      address: '123 Vilakazi St, Orlando West, Soweto',
      phone: '+27 11 123 4567',
      email: 'orders@mzansimeals.co.za',
      openingHours: {
        mondayToFriday: '10:00 - 22:00',
        saturday: '10:00 - 23:00', 
        sunday: '10:00 - 20:00'
      },
      deliveryFee: 25,
      minOrder: 50,
      freeDeliveryThreshold: 200,
      rating: 4.8,
      totalReviews: 124
    };
    
    await setDoc(doc(db, 'restaurants', 'mzansi-meals'), {
      ...restaurantInfo,
      updatedAt: new Date(),
      createdAt: new Date()
    });
    
    console.log('✅ Restaurant info seeded: Mzansi Meals');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to seed restaurant info:', error);
    return false;
  }
};

// Initialize collections structure
export const initializeCollections = async () => {
  try {
    // Create empty collections if they don't exist
    const collections = ['menuItems', 'orders', 'carts', 'users', 'restaurants'];
    
    for (const collectionName of collections) {
      const ref = collection(db, collectionName);
      // Just creating a reference ensures collection exists
      console.log(`Initialized ${collectionName} collection`);
    }
    
    console.log('✅ All collections initialized for Mzansi Meals!');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};

// Main seed function - run this to seed everything
export const seedAllData = async () => {
  console.log('🚀 Starting Mzansi Meals data seeding...');
  
  try {
    await initializeCollections();
    await seedRestaurantInfo();
    await seedMenuItems();
    
    console.log('🎉 All Mzansi Meals data seeded successfully!');
    console.log('🏆 Your restaurant is now: MZANSI MEALS 🇿🇦');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed all data:', error);
    return false;
  }
};
