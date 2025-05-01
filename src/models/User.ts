import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  bio: String,
  image: String,
  links: [
    {
      title: String,
      url: String,
      icon: String,
    }
  ],
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);