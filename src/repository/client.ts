import { AppDataSource } from '~/app-data-source';
import { Client } from '~/entities/client';

export const ClientRepository = AppDataSource.getRepository(Client).extend({});
