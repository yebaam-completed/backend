import Joi from 'joi';

export const sendFriendRequestSchema = Joi.object({
  receiverId: Joi.string().required()
});

export const respondFriendRequestSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected').required()
});
