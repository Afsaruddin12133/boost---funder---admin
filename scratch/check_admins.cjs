const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://afsaruddin12133_db_boostfundr:afsaruddin12133@boostfundr-cluster-1.niuejfl.mongodb.net/?appName=boostfundr-cluster-1";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

async function checkAdmins() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const admins = await User.find({ role: 'admin' });
    console.log('Admins found:', admins.length);
    admins.forEach(admin => {
      console.log(`- ${admin.email}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdmins();
