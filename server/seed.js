const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fixwala';

const sampleServices = [
  {
    name: 'AC Repair & Service',
    description: 'Expert fixes for all AC brands. Installation, repair, and maintenance services.',
    icon: '❄️',
    price: 499,
    duration: '1-2 hours',
    category: 'appliance',
    isActive: true
  },
  {
    name: 'Electrical Services',
    description: 'Wiring, installations, and safety checks by certified professionals.',
    icon: '⚡',
    price: 399,
    duration: '1-2 hours',
    category: 'electrical',
    isActive: true
  },
  {
    name: 'Plumbing Services',
    description: 'Leak fixes, fitting installations, and drainage solutions.',
    icon: '🚿',
    price: 349,
    duration: '1-2 hours',
    category: 'plumbing',
    isActive: true
  },
  {
    name: 'Washing Machine Repair',
    description: 'Professional repair service for all washing machine brands.',
    icon: '🌀',
    price: 449,
    duration: '1-2 hours',
    category: 'appliance',
    isActive: true
  },
  {
    name: 'Refrigerator Repair',
    description: 'Quick and efficient refrigerator repair and maintenance.',
    icon: '🧊',
    price: 599,
    duration: '2-3 hours',
    category: 'appliance',
    isActive: true
  },
  {
    name: 'Geyser Installation & Repair',
    description: 'Expert geyser installation, repair, and maintenance services.',
    icon: '🔥',
    price: 399,
    duration: '1-2 hours',
    category: 'appliance',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`Added ${services.length} services to the database`);

    // Display added services
    console.log('\nAdded Services:');
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} - ₹${service.price}`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
