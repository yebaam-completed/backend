import mongoose, { Schema } from 'mongoose';

// Reel Schema
const reelSchema: Schema = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 }
  });
  
  // Story Schema
  const storySchema: Schema = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiration: { type: Date, required: true },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });
  
  // Crear los modelos
  const ReelModel = mongoose.model('Reel', reelSchema);
  const StoryModel = mongoose.model('Story', storySchema);
  
  // Exportar los modelos
  export { ReelModel, StoryModel };
  