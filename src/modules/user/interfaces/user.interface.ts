import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';


export interface IUserDocument extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  infoGeneral: IInformacionGeneral;
  empleo: IEmpleoFormacion;
  residendencia: IResidencia;
  contact: IContactoBasico;
  relacion: IRelacion;
  perfil: IPerfil;
  acontecimientos: IAcontecimiento;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  privacy?: string;
  privacySettings?: { 
    friendsList?: string;
    photos?: string;
    posts?: string;
  };
  lastActive?: Date;
  featuredFriends?: mongoose.Types.ObjectId[];
  savedPosts?: mongoose.Types.ObjectId[];
  preferences?: {
    notificationSound?: boolean;
    darkMode?: boolean;
    language?: string;
  };
  searchHistory?: {
    term: string;
    date: Date;
  }[];
  friendRequests?: {
    sender: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    date: Date;
  }[];
  friends?: string[];
  createdAt?: Date;
}


export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
  friendRequests: boolean;

}


export interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface ISearchUser {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  avatarColor: string;
}

export interface ISocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface ILogin {
  userId: string;
}

export interface IUserJobInfo {
  key?: string;
  value?: string | ISocialLinks;
}

export interface IUserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | INotificationSettings | IUserDocument;
}

export interface IEmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface IAllUsers {
  users: IUserDocument[];
  totalUsers: number;
}

export interface IEducacion {
  id: string;
  titulo: string;
  universidad?: string;
  activo: boolean;
}
export interface IDetalles {
  presentacion?: string;
  educacion: IEducacion[];
  destacados?: string[];
  activo?: boolean;

}

export interface IPronombres {
  id: string;
  pronombre: string;
}

export interface IEmpleo {
  id: string;
  titulo: string;
  empresa?: string;
  activo?: boolean;
}

export interface IInformacionGeneral {
  empleoActual: string;
  estudioActual: string;
  ciudad: string;
  lugarOrigen: string;
  situacionSentimental?: string;
  telefono?: string;
}

// Empleo y formación
export interface IEmpleoFormacion {
  id: string;
  titulo: string;
  lugar: string;
  desde: Date;
  hasta?: Date;
}

// Residencia
export interface IResidencia {
  ciudad: string;
  pais: string;
}

// Contacto básico
export interface IContactoBasico {
  telefono: string;
  email: string;
}

// Familia y relaciones
export interface IRelacion {
  tipo: string;
  nombre: string;
}

// Acontecimientos importantes
export interface IAcontecimiento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
}

// Interfaz principal para detalles del perfil
export interface IPerfil {
  informacionGeneral: IInformacionGeneral;
  empleoFormacion?: IEmpleoFormacion[];
  empleo: IEmpleo[];
  educacion: IEducacion[];
  infoUsuario: IInfoUsuario;
  presentacion?: IDetalles;
  residencias?: IResidencia[];
  contactoBasico?: IContactoBasico;
  relaciones?: IRelacion[];
  acontecimientosImportantes?: IAcontecimiento[];
}

export interface IInfoUsuario {
  intereses: string[];
  pasatiempos: string[];
}


export interface IBasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
  infoProfile:IPerfil
  
}


// 

// export interface IHistoria {
//   id: string;
//   autorId: string;
//   contenido: string;
//   fechaExpiracion: Date;
// }

// export interface IAnuncio {
//   id: string;
//   producto: IProducto;
//   fechaPublicacion: Date;
// }