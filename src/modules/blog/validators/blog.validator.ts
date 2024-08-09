import Joi, { ObjectSchema } from 'joi';

const blogSchema: ObjectSchema = Joi.object().keys({
  // userId: Joi.string().required().messages({
  //   'any.required': 'User ID is a required field',
  //   'string.empty': 'User ID property is not allowed to be empty'
  // }),
  title: Joi.string().required().messages({
    'any.required': 'Title is a required field',
    'string.empty': 'Title property is not allowed to be empty'
  }),
  content: Joi.string().required().messages({
    'any.required': 'Content is a required field',
    'string.empty': 'Content property is not allowed to be empty'
  }),
  imgVersion: Joi.string().optional().allow(null, ''),
  imgId: Joi.string().optional().allow(null, ''),
  tags: Joi.array().items(Joi.string().optional()).optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

const blogWithImageSchema: ObjectSchema = Joi.object().keys({
  // userId: Joi.string().required().messages({
  //   'any.required': 'User ID is a required field',
  //   'string.empty': 'User ID property is not allowed to be empty'
  // }),
  title: Joi.string().required().messages({
    'any.required': 'Title is a required field',
    'string.empty': 'Title property is not allowed to be empty'
  }),
  content: Joi.string().required().messages({
    'any.required': 'Content is a required field',
    'string.empty': 'Content property is not allowed to be empty'
  }),
  imgVersion: Joi.string().optional().messages({
    'any.required': 'Image version is a required field',
    'string.empty': 'Image version property is not allowed to be empty'
  }),
  imgId: Joi.string().optional().messages({
    'any.required': 'Image ID is a required field',
    'string.empty': 'Image ID property is not allowed to be empty'
  }),
  tags: Joi.array().items(Joi.string().optional()).optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

export { blogSchema, blogWithImageSchema };
