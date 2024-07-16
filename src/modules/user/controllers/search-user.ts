import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Helpers } from '@globals/helpers/helpers';
import { ISearchUser } from '@user/interfaces/user.interface';
import { userService } from '@user/services/user.service';

export class Search {
  public async user(req: Request, res: Response): Promise<void> {
    try {
      // Paso 1: Verificar las entradas
      const query = req.params.query;
      // console.log(`Query de búsqueda: ${query}`);

      // Paso 2: Verificar la creación de la expresión regular
      const regex = new RegExp(Helpers.escapeRegex(query), 'i');
      // console.log(`Expresión regular de búsqueda regex: ${regex}`);

      // Paso 3: Verificar el servicio de usuario
      const users: ISearchUser[] = await userService.searchUsers(regex);
      // console.log('Resultados de la búsqueda:', users);

      // Paso 4: Registrar información de depuración
      // Agrega registros adicionales si es necesario para rastrear el flujo de ejecución.

      // Paso 5: Capturar errores
      res.status(HTTP_STATUS.OK).json({ message: 'Search results', search: users });
    } catch (error) {
      // Manejar errores
      console.error('Error en la búsqueda de usuarios:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
}
