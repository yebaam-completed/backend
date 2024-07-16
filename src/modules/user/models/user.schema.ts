import { IUserDocument } from '@user/interfaces/user.interface';
import mongoose, { model, Model, Schema } from 'mongoose';
import { friendRequestSchema } from './friendRequestSchema';

const userSchema: Schema = new Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true },
  profilePicture: { type: String, default: '' },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  passwordResetToken: { type: String, default: '' },
  passwordResetExpires: { type: Number },
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: {
    messages: { type: Boolean, default: true },
    reactions: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true }
  },
  social: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  work: { type: String, default: '' },
  school: { type: String, default: '' },
  location: { type: String, default: '' },
  birtday: { type: String, default: '' },
  gender: { type: String, default: '' },
  termins: { type: String, default: '' },
  quote: { type: String, default: '' },

  bgImageVersion: { type: String, default: '' },
  bgImageId: { type: String, default: '' },

    // Campos nuevos agregados
    privacy: { type: String, default: 'public' },
    privacySettings: {
      friendsList: { type: String, default: 'public' },
      photos: { type: String, default: 'public' },
      posts: { type: String, default: 'public' }
    },
    lastActive: { type: Date },
    featuredFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    preferences: {
      notificationSound: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: 'en' }
    },
    searchHistory: [{
      term: { type: String },
      date: { type: Date }
    }],
    infoGeneral: {
      empleoActual: { type: String, default: '' },
      estudioActual: { type: String, default: '' },
      ciudad: { type: String, default: '' },
      lugarOrigen: { type: String, default: '' },
      situacionSentimental: { type: String, default: '' },
      telefono: { type: String, default: '' }
    },
    empleo: {
      id: { type: String },
      titulo: { type: String },
      lugar: { type: String },
      desde: { type: Date },
      hasta: { type: Date }
    },
    residendencia: {
      ciudad: { type: String },
      pais: { type: String }
    },
    contact: {
      telefono: { type: String, default: '' },
      email: { type: String, default: '' }
    },
    relacion: {
      tipo: { type: String },
      nombre: { type: String }
    },
    perfil: {
      informacionGeneral: {
        empleoActual: { type: String },
        estudioActual: { type: String },
        ciudad: { type: String }
      },
      empleoFormacion: [{
        id: { type: String },
        titulo: { type: String },
        lugar: { type: String },
        desde: { type: Date },
        hasta: { type: Date }
      }],
      empleo: [{
        id: { type: String },
        titulo: { type: String },
        empresa: { type: String },
        activo: { type: Boolean }
      }],
      educacion: [{
        id: { type: String },
        titulo: { type: String },
        universidad: { type: String },
        activo: { type: Boolean }
      }],
      infoUsuario: {
        intereses: [{ type: String }],
        pasatiempos: [{ type: String }]
      }
    },
      // Campo para solicitudes de amistad
      friendRequests: { type: [friendRequestSchema], default: [] },
      friends: { type: [String], default: [] },

  friendsCount: { type: Number, default: 0 },
  reels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reel' }],
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],

  detalles: {
    presentacion: { type: String, default: '' },
    educacion: [{
      id: { type: String },
      titulo: { type: String },
      universidad: { type: String },
      activo: { type: Boolean, default: true }
    }],
    destacados: [{ type: String }],
    activo: { type: Boolean, default: true }
  },



});

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
