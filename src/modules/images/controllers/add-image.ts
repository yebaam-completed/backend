import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { addImageSchema } from '@image/schemes/images';
import { UploadApiResponse } from 'cloudinary';
import { IUserDocument } from '@user/interfaces/user.interface';
import { socketIOImageObject } from '../../../shared/sockets/image';
import { imageQueue } from '../../../shared/services/queues/image.queue';
import { IBgUploadResponse } from '@image/interfaces/image.interface';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { uploads } from '../../../shared/global/helpers/cloudinary-upload';
import { BadRequestError } from '../../../shared/global/helpers/error-handler';
import { Helpers } from '../../../shared/global/helpers/helpers';
import { UserCache } from '@user/redis/user.cache';

const userCache: UserCache = new UserCache();

export class Add {
  @joiValidation(addImageSchema)
  public async profileImage(req: Request, res: Response): Promise<void> {
    const result: UploadApiResponse = (await uploads(req.body.image, req.currentUser!.userId, true, true)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError('File upload: Error occurred. Try again.');
    }
    const url = `https://res.cloudinary.com/dzqpacupf/image/upload/v${result.version}/${result.public_id}`;
    const cachedUser: IUserDocument = (await userCache.updateSingleUserItemInCache(
      `${req.currentUser!.userId}`,
      'profilePicture',
      url
    )) as IUserDocument;
    socketIOImageObject.emit('update user', cachedUser);
    imageQueue.addImageJob('addUserProfileImageToDB', {
      key: `${req.currentUser!.userId}`,
      value: url,
      imgId: result.public_id,
      imgVersion: result.version.toString()
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Image added successfully' });
  }

  public async backgroundImage(req: Request, res: Response): Promise<void> {
    console.log('Received image data:', req.body.image.substring(0, 30)); // Depuración

    try {
      const { version, publicId }: IBgUploadResponse = await Add.prototype.backgroundUpload(req.body.image);

      // Depuración: Verificar version y publicId
      console.log('Version:', version, 'PublicId:', publicId);

      const bgImageId: Promise<IUserDocument | null> = userCache.updateSingleUserItemInCache(
        `${req.currentUser!.userId}`,
        'bgImageId',
        publicId
      );

      const bgImageVersion: Promise<IUserDocument | null> = userCache.updateSingleUserItemInCache(
        `${req.currentUser!.userId}`,
        'bgImageVersion',
        version
      );

      const response: [IUserDocument | null, IUserDocument | null] = await Promise.all([bgImageId, bgImageVersion]);
      console.log('Cache update response:', response); // Depuración

      socketIOImageObject.emit('update user', {
        bgImageId: publicId,
        bgImageVersion: version,
        userId: response[0]
      });

      imageQueue.addImageJob('updateBGImageInDB', {
        key: `${req.currentUser!.userId}`,
        imgId: publicId,
        imgVersion: version.toString()
      });

      res.status(HTTP_STATUS.OK).json({ message: 'Image added successfully' });
    } catch (error) {
      console.error('Error in backgroundImage:', error); // Depuración
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred' });
    }
  }

  private async backgroundUpload(image: string): Promise<IBgUploadResponse> {
    const isDataURL = Helpers.isDataURL(image);
    console.log('Is data URL:', isDataURL); // Depuración

    let version = '';
    let publicId = '';

    if (isDataURL) {
      const result: UploadApiResponse = await uploads(image);
      console.log('Cloudinary upload result:', result); // Depuración

      if (!result.public_id) {
        throw new BadRequestError(result.message);
      } else {
        version = result.version.toString();
        publicId = result.public_id;
      }
    } else {
      const value = image.split('/');
      version = value[value.length - 2];
      publicId = value[value.length - 1];
    }

    return { version: version.replace(/v/g, ''), publicId };
  }

  // @joiValidation(addImageSchema)
  // public async backgroundImage(req: Request, res: Response): Promise<void> {
  //   console.log("Received image data:", req.body.image.substring(0, 30)); // Depuración

  //   const { version, publicId }: IBgUploadResponse = await Add.prototype.backgroundUpload(req.body.image);
  //   const bgImageId: Promise<IUserDocument> = userCache.updateSingleUserItemInCache(
  //     `${req.currentUser!.userId}`,
  //     'bgImageId',
  //     publicId
  //   ) as Promise<IUserDocument>;
  //   const bgImageVersion: Promise<IUserDocument> = userCache.updateSingleUserItemInCache(
  //     `${req.currentUser!.userId}`,
  //     'bgImageVersion',
  //     version
  //   ) as Promise<IUserDocument>;
  //   const response: [IUserDocument, IUserDocument] = (await Promise.all([bgImageId, bgImageVersion])) as [IUserDocument, IUserDocument];
  //   socketIOImageObject.emit('update user', {
  //     bgImageId: publicId,
  //     bgImageVersion: version,
  //     userId: response[0]
  //   });
  //   imageQueue.addImageJob('updateBGImageInDB', {
  //     key: `${req.currentUser!.userId}`,
  //     imgId: publicId,
  //     imgVersion: version.toString()
  //   });
  //   res.status(HTTP_STATUS.OK).json({ message: 'Image added successfully' });
  // }

  // private async backgroundUpload(image: string): Promise<IBgUploadResponse> {
  //   const isDataURL = Helpers.isDataURL(image);
  //   let version = '';
  //   let publicId = '';
  //   if (isDataURL) {
  //     const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
  //     if (!result.public_id) {
  //       throw new BadRequestError(result.message);
  //     } else {
  //       version = result.version.toString();
  //       publicId = result.public_id;
  //     }
  //   } else {
  //     const value = image.split('/');
  //     version = value[value.length - 2];
  //     publicId = value[value.length - 1];
  //   }
  //   return { version: version.replace(/v/g, ''), publicId };
  // }
}
