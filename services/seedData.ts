import { db } from '@/app/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedSampleData = async () => {
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
      await addDoc(collection(db, 'categories'), cat);
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
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433?w=400',
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
      },
      {
        name: 'Truffle Pasta',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
        description: 'Fresh pasta with black truffle cream sauce and parmesan',
        ingredients: ['Fresh pasta', 'Black truffle', 'Cream', 'Parmesan', 'Herbs'],
        category: 'pasta'
      },
      {
        name: 'Spaghetti Carbonara',
        price: 21.99,
        image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400',
        description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
        ingredients: ['Spaghetti', 'Eggs', 'Parmesan', 'Pancetta', 'Black pepper'],
        category: 'pasta'
      },
      {
        name: 'Chocolate Lava Cake',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla ice cream'],
        category: 'desserts'
      },
      {
        name: 'Crème Brûlée',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
        description: 'Classic French dessert with caramelized sugar crust',
        ingredients: ['Cream', 'Egg yolks', 'Sugar', 'Vanilla bean'],
        category: 'desserts'
      }
    ];

    for (const item of menuItems) {
      await addDoc(collection(db, 'menuItems'), item);
      console.log(`✅ Added menu item: ${item.name}`);
    }

    console.log('🎉 Sample data added successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    return false;
  }
};
