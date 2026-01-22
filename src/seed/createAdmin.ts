import mongoose from 'mongoose';
import config from '../app/config';
import { UserService } from '../app/modules/user/user.service';
import { User } from '../app/modules/user/user.model';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aiera.edu';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'System Admin';

async function seedAdmin() {
  if (!config.database_url) {
    throw new Error('DATABASE_URL is not set');
  }

  await mongoose.connect(config.database_url);

  const existingAdmin = await User.findOne({
    email: ADMIN_EMAIL.toLowerCase(),
  });
  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.email);
    await mongoose.disconnect();
    return;
  }

  const { user, generatedPassword } = await UserService.createUser({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    role: 'admin',
    password: ADMIN_PASSWORD,
  });

  console.log('Admin created');
  console.log('Email:', user.email);
  console.log('Password:', generatedPassword || ADMIN_PASSWORD);

  await mongoose.disconnect();
}

seedAdmin().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
