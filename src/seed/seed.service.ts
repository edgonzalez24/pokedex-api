import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executedSeed() {
    await this.pokemonModel.deleteMany({}); //delete * from pokemon

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // const insertPromisesArray = [];
    const pokemonInsert: { name: string; no: number }[] = [];

    data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      // insertPromisesArray.push(this.pokemonModel.create({ name, no }));
      pokemonInsert.push({ name, no });
    });

    // await Promise.all(insertPromisesArray);
    this.pokemonModel.insertMany(pokemonInsert);
    return 'seed executed';
  }
}
