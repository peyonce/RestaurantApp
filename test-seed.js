// Run this once to add sample data to Firestore
import { seedSampleData } from './app/services/seedData';

(async () => {
  console.log('Starting seed data script...');
  await seedSampleData();
  console.log('Done! Check Firebase Console → Firestore → Data tab');
})();
