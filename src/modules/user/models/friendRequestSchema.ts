// esquema para las solicitudes de amistad
import mongoose, { Schema } from 'mongoose';

const friendRequestSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now } // <--- aquí, 'Date' está siendo usado correctamente
});


export { friendRequestSchema };
