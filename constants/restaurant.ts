export const RESTAURANT = {
  NAME: 'Mzansi Meals',
  SLOGAN: 'Taste the Rainbow Nation',
  DESCRIPTION: 'Authentic South African cuisine with a modern twist',
  ADDRESS: '123 Vilakazi St, Orlando West, Soweto',
  PHONE: '+27 11 123 4567',
  EMAIL: 'info@mzansimeals.co.za',
  OPENING_HOURS: {
    WEEKDAYS: '10:00 - 22:00',
    SATURDAY: '10:00 - 23:00',
    SUNDAY: '10:00 - 20:00'
  },
  DELIVERY: {
    FEE: 25,
    MIN_ORDER: 50,
    FREE_THRESHOLD: 200
  },
  SOCIAL: {
    INSTAGRAM: '@mzansi_meals',
    TWITTER: '@MzansiMeals',
    FACEBOOK: 'MzansiMealsSA'
  },
  COLORS: {
    PRIMARY: '#1a1a1a',  
    SECONDARY: '#FFD700', 
    ACCENT: '#E31B23'  
  }
} as const;

export type Restaurant = typeof RESTAURANT;
