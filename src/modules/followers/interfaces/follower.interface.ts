import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';
import { IUserDocument } from '@user/interfaces/user.interface';

export interface IFollowers {
  userId: string;
}

export interface IFollowerDocument extends Document {
  _id: mongoose.Types.ObjectId | string;
  followerId: mongoose.Types.ObjectId;
  followeeId: mongoose.Types.ObjectId;
  createdAt?: Date;
}

export interface IFollower {
  _id: mongoose.Types.ObjectId | string;
  followeeId?: IFollowerData;
  followerId?: IFollowerData;
  createdAt?: Date;
}

export interface IFollowerData {
  avatarColor: string;
  followersCount: number;
  followingCount: number;
  profilePicture: string;
  postCount: number;
  username: string;
  uId: string;
  _id?: mongoose.Types.ObjectId;
  userProfile?: IUserDocument;
}

export interface IFollowerJobData {
  keyOne?: string;
  keyTwo?: string;
  username?: string;
  followerDocumentId?: ObjectId;
}

export interface IBlockedUserJobData {
  keyOne?: string;
  keyTwo?: string;
  type?: string;
}



// Interfaz para un solo amigo
export interface IAmigo {
  id: string;
  nombre: string;
  ciudadActual?: string;
  ciudadOrigen?: string;
  cumpleaños?: string;
  seguidores?: number;
  seguidos?: number;
}

// Interfaz para agrupar las categorías de amigos
export interface ISeccionAmigos {
  todosLosAmigos: IAmigo[];
  cumpleanos?: IAmigo[];
  ciudadActual?: IAmigo[];
  ciudadOrigen?: IAmigo[];
  seguidores?: IAmigo[];
  seguidos?: IAmigo[];
}

// Interfaz para la función de búsqueda de amigos
export interface IBuscarAmigos {
  query: string;
  resultado: IAmigo[];
}

// Interfaz para solicitudes de amistad pendientes
export interface ISolicitudAmistad {
  id: string;
  nombre: string;
  mensaje?: string;
  fechaSolicitud: Date;
}

