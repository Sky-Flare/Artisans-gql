import { Client } from '@entity/client';
import { AppDataSource } from '~/app-data-source';

export const ClientRepository = AppDataSource.getRepository(Client).extend({});
