/* eslint-disable @typescript-eslint/no-unused-vars */
// schema.ts
import Joi, { ObjectSchema } from 'joi';

// Esquema de Información General
const informacionGeneralSchema: ObjectSchema = Joi.object().keys({
  empleoActual: Joi.string().required(),
  estudioActual: Joi.string().required(),
  ciudad: Joi.string().required(),
  lugarOrigen: Joi.string().optional().allow(null, ''),
  situacionSentimental: Joi.string().optional().allow(null, ''),
  telefono: Joi.string().optional().allow(null, '')
});

// Esquema de Empleo y Formación
const empleoFormacionSchema: ObjectSchema = Joi.object().keys({
  id: Joi.string().required(),
  titulo: Joi.string().required(),
  lugar: Joi.string().optional().allow(null, ''),
  desde: Joi.date().required(),
  hasta: Joi.date().optional().allow(null, '')
});

const empleoSchema: ObjectSchema = Joi.object().keys({
  id: Joi.string().required(),
  titulo: Joi.string().required(),
  empresa: Joi.string().optional().allow(null, ''),
  activo: Joi.boolean().optional()
});

// Esquema de Residencia
const residenciaSchema: ObjectSchema = Joi.object().keys({
  ciudad: Joi.string().required(),
  pais: Joi.string().required()
});

// Esquema de Contacto Básico
const contactoBasicoSchema: ObjectSchema = Joi.object().keys({
  telefono: Joi.string().required(),
  email: Joi.string().required().email()
});

// Esquema de Relaciones
const relacionSchema: ObjectSchema = Joi.object().keys({
  tipo: Joi.string().required(),
  nombre: Joi.string().required()
});
const educacionSchema: ObjectSchema = Joi.object().keys({
  id: Joi.string().required(),
  titulo: Joi.string().required(),
  universidad: Joi.string().optional().allow(null, ''),
  activo: Joi.boolean().required()
});
const infoUsuarioSchema: ObjectSchema = Joi.object().keys({
  intereses: Joi.array().items(Joi.string()).optional(),
  pasatiempos: Joi.array().items(Joi.string()).optional()
});


// Esquema de Acontecimientos Importantes
const acontecimientosImportantesSchema: ObjectSchema = Joi.object().keys({
  id: Joi.string().required(),
  titulo: Joi.string().required(),
  descripcion: Joi.string().required(),
  fecha: Joi.date().required()
});

// Esquema de Perfil Completo
const perfilSchema: ObjectSchema = Joi.object().keys({
  informacionGeneral: informacionGeneralSchema.required(),
  empleoFormacion: Joi.array().items(empleoFormacionSchema).optional(),
  empleo: Joi.array().items(empleoSchema).optional(),
  educacion: Joi.array().items(educacionSchema).optional(),
  infoUsuario: infoUsuarioSchema.optional(),
  acontecimientosImportantes: Joi.array().items(acontecimientosImportantesSchema).optional(),
  contactoBasico: contactoBasicoSchema.optional(), 

});

// Esquema de Información Básica
// const basicInfoSchema: ObjectSchema = Joi.object().keys({
//   quote: Joi.string().optional().allow(null, ''),
//   work: Joi.string().optional().allow(null, ''),
//   school: Joi.string().optional().allow(null, ''),
//   location: Joi.string().optional().allow(null, ''),
//   perfil: perfilSchema.optional()
// });

// Esquema actualizado para incluir todos los campos necesarios

const basicInfoSchema: ObjectSchema = Joi.object().keys({
  quote: Joi.string().optional().allow(null, ''),
  work: Joi.string().optional().allow(null, ''),
  school: Joi.string().optional().allow(null, ''),
  location: Joi.string().optional().allow(null, ''),

});


// Esquema de Enlaces Sociales
const socialLinksSchema: ObjectSchema = Joi.object().keys({
  facebook: Joi.string().optional().allow(null, ''),
  instagram: Joi.string().optional().allow(null, ''),
  twitter: Joi.string().optional().allow(null, ''),
  youtube: Joi.string().optional().allow(null, '')
});

// Esquema de Cambio de Contraseña
const changePasswordSchema: ObjectSchema = Joi.object().keys({
  currentPassword: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password should be a type of string',
    'string.min': 'Password must have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
    'string.empty': 'Password is a required field'
  }),
  newPassword: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password should be a type of string',
    'string.min': 'Password must have a minimum length of {#limit}',
    'string.max': 'Password should have a maximum length of {#limit}',
    'string.empty': 'Password is a required field'
  }),
  confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
    'any.only': 'Confirm password does not match new password.'
  })
});

// Esquema de Configuración de Notificaciones
const notificationSettingsSchema: ObjectSchema = Joi.object().keys({
  messages: Joi.boolean().optional(),
  reactions: Joi.boolean().optional(),
  comments: Joi.boolean().optional(),
  follows: Joi.boolean().optional()
});

// Esquema de Estado Personalizado
const customStatusSchema: ObjectSchema = Joi.object().keys({
  userId: Joi.string().required(),
  status: Joi.string().max(100).required()
});

// Esquema de Reporte de Abuso
const reportAbuseSchema: ObjectSchema = Joi.object().keys({
  reporterId: Joi.string().required(),
  reportedId: Joi.string().required(),
  reason: Joi.string().required().max(500),
  evidenceUrl: Joi.string().uri().optional().allow(null, '')
});

// Esquema para Crear Grupo
const createGroupSchema: ObjectSchema = Joi.object().keys({
  groupName: Joi.string().required().max(50),
  creatorId: Joi.string().required(),
  members: Joi.array().items(Joi.string().required()).min(1)
});

// Esquema para Mensajes
const messageSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().required(),
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
  body: Joi.string().max(1000).allow('', null),
  gifUrl: Joi.string().uri().optional().allow(null, ''),
  selectedImage: Joi.string().uri().optional().allow(null, ''),
  isRead: Joi.boolean().optional()
});

// Esquema de Solicitud de Amistad
const friendRequestSchema: ObjectSchema = Joi.object().keys({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required()
});


export {
  basicInfoSchema,
  socialLinksSchema,
  changePasswordSchema,
  notificationSettingsSchema,
  messageSchema,
  friendRequestSchema,
  createGroupSchema,
  reportAbuseSchema,
  customStatusSchema,
  perfilSchema
};
