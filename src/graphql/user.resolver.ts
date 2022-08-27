import { Resolver, Query, Arg } from 'type-graphql';
import { Service } from 'typedi';
import { AppDataSource } from '../app-data-source';

@Resolver()
@Service()
export class UserResolver {
  @Query()
  public async user() {
    return 'ici';
  }
}
