import { IFriendRequestJobData } from '@root/modules/sendfriend/interfaces/sendfriend.interfaces';
import { notificationService } from '@service/db/notification.service';
import { DoneCallback, Job } from 'bull';
import { ObjectId } from 'mongodb';

export class FriendRequestWorker {
  async processFriendRequest(job: Job<IFriendRequestJobData>, done: DoneCallback): Promise<void> {
    try {
      const { senderId, receiverId, status, requestId } = job.data;

      // Convertir ObjectId a string
      const senderIdString = senderId instanceof ObjectId ? senderId.toString() : senderId;
      const receiverIdString = receiverId instanceof ObjectId ? receiverId.toString() : receiverId;
      const requestIdString = requestId ? (requestId instanceof ObjectId ? requestId.toString() : requestId) : undefined;

      switch (status) {
        case 'pending':
          await notificationService.sendNotification({
            toUserId: receiverIdString,
            fromUserId: senderIdString,
            type: 'newFriendRequest',
            requestId: requestIdString,
            message: `Tienes una nueva solicitud de amistad de ${senderIdString}`
          });
          break;
        case 'accepted':
          await notificationService.sendNotification({
            toUserId: senderIdString,
            fromUserId: receiverIdString,
            type: 'friendRequestAccepted',
            requestId: requestIdString,
            message: `${receiverIdString} ha aceptado tu solicitud de amistad`
          });
          break;
        case 'rejected':
          await notificationService.sendNotification({
            toUserId: senderIdString,
            fromUserId: receiverIdString,
            type: 'friendRequestRejected',
            requestId: requestIdString,
            message: `${receiverIdString} ha rechazado tu solicitud de amistad`
          });
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
