/* eslint-disable @typescript-eslint/no-explicit-any */

import { notificationService } from '@service/db/notification.service';
import { DoneCallback, Job } from 'bull';
import { ObjectId } from 'mongodb';

interface IFriendRequestJobData {
  senderId: string | ObjectId;
  receiverId: string | ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  requestId?: string | ObjectId;
}

export class FriendRequestWorker {
  async processFriendRequest(job: Job, done: DoneCallback): Promise<void> {
    try {
      // Asumimos que job.data tiene la estructura de IFriendRequestJobData
      const data = job.data as IFriendRequestJobData;
      const { senderId, receiverId, status, requestId } = data;

      // Convertir ObjectId a string
      const senderIdString = senderId instanceof ObjectId ? senderId.toString() : senderId;
      const receiverIdString = receiverId instanceof ObjectId ? receiverId.toString() : receiverId;
      const requestIdString = requestId ? (requestId instanceof ObjectId ? requestId.toString() : requestId) : undefined;

      switch (status) {
        case 'pending':
          // Lógica para 'pending'
          break;
        case 'accepted':
          // Lógica para 'accepted'
          break;
        case 'rejected':
          // Lógica para 'rejected'
          break;
        default:
          throw new Error(`Estado desconocido: ${status}`);
      }

      done(null, job.data);
    } catch (error) {
      if (error instanceof Error) {
        done(error);
      } else {
        done(new Error('An unknown error occurred'));
      }
    }
  }
}

export const friendRequestWorker = new FriendRequestWorker();
