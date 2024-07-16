import mongoose, { Document } from 'mongoose';
import { AuthPayload } from '@auth/interfaces/auth.interface';
import { IReaction } from '@reaction/interfaces/reaction.interface';

export interface IMessageDocument extends Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  senderUsername: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  body: string;
  gifUrl: string;
  isRead: boolean;
  selectedImage: string;
  reaction: IReaction[];
  createdAt: Date;
  deleteForMe: boolean;
  deleteForEveryone: boolean;
}

export interface IMessageData {
  _id: string | mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  receiverId: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderId: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  body: string;
  isRead: boolean;
  gifUrl: string;
  selectedImage: string;
  reaction: IReaction[];
  createdAt: Date | string;
  deleteForMe: boolean;
  deleteForEveryone: boolean;
}

export interface IMessageNotification {
  currentUser: AuthPayload;
  message: string;
  receiverName: string;
  receiverId: string;
  messageData: IMessageData;
}

export interface IChatUsers {
  userOne: string;
  userTwo: string;
}

export interface IChatList {
  receiverId: string;
  conversationId: string;
}

export interface ITyping {
  sender: string;
  receiver: string;
}

export interface IChatJobData {
  senderId?: mongoose.Types.ObjectId | string;
  receiverId?: mongoose.Types.ObjectId | string;
  messageId?: mongoose.Types.ObjectId | string;
  senderName?: string;
  reaction?: string;
  type?: string;
}

export interface ISenderReceiver {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
}

export interface IGetMessageFromCache {
  index: number;
  message: string;
  receiver: IChatList;
}

export enum MessageStatus {
  Sent = 'Sent',
  Delivered = 'Delivered',
  Read = 'Read',
  Failed = 'Failed'
}


// para los chat en grupos
export interface IGroupChat {
  groupId: string;
  groupName: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupMessage extends IMessageDocument {
  groupId: string;
}

// para agregar archivos
export interface IAttachment {
  type: 'image' | 'video' | 'file';
  url: string;
  name?: string;
}

export interface IMessageWithAttachment extends IMessageDocument {
  attachments: IAttachment[];
}

// Añadir cifrado o identificadores para mensajes que deben ser destruidos después de la lectura (mensajes efímeros).
export interface IMessageSecure extends IMessageDocument {
  encryptionKey?: string;
  selfDestructAfter?: Date;
}

// Historial de Conversación:
export interface IChatArchive {
  conversationId: string;
  messages: IMessageData[];
  archivedAt: Date;
}

// Incluir interfaces para integrar notificaciones push con servicios externos.
export interface INotificationServicePayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}
