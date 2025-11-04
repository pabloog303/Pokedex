import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class SPokemon {

  // URL base de la API Pokemon (solo lectura)
  private readonly baseUrl = 'https://pokeapi.co/api/v2/';
  private readonly pokemonEndpoint = 'pokemon';

  // Variables para manejar la paginación
  public nextUrl: string | null = `${this.baseUrl}${this.pokemonEndpoint}?limit=20&offset=0`;
  public previous: string | null = null;
  public current: string = `${this.pokemonEndpoint}?limit=20&offset=0`;

  constructor() { }

  // Método para verificar si hay más pokemones disponibles
  hasMorePokemons(): boolean {
    return this.nextUrl !== null;
  }

  // Método para resetear la paginación
  resetPagination(): void {
    this.nextUrl = `${this.baseUrl}${this.pokemonEndpoint}?limit=20&offset=0`;
    this.previous = null;
  }

  processPokemon(pokemonData: any): IPokemon {
    // Crear objeto pokemon del tipo IPokemon
    const pokemon: IPokemon = {
      id: pokemonData.id.toString(),
      name: pokemonData.name,
      type1: pokemonData.types[0].type.name,
      sprite: pokemonData.sprites.front_default,
      height: pokemonData.height.toString(),
      weight: pokemonData.weight.toString(),
      abilities: pokemonData.abilities.map((ability: any) => ability.ability.name).join(', '),
      stats: pokemonData.stats.map((stat: any) => ({
        base_stat: stat.base_stat.toString(),
        name: stat.stat.name
      }))
    };

    // Manejar propiedades opcionales
    if (pokemonData.types.length > 1) {
      pokemon.type2 = pokemonData.types[1].type.name;
    }

    // Buscar hidden ability
    const hiddenAbility = pokemonData.abilities.find((ability: any) => ability.is_hidden);
    if (hiddenAbility) {
      pokemon.hiddenAbility = hiddenAbility.ability.name;
    }

    return pokemon;
  }

  async getPokemons(): Promise<IPokemon[] | null> {
    if(this.nextUrl) {
      const response = await CapacitorHttp.get({url:this.nextUrl, params:{}});
      console.log("La respuesta es: ");
      console.log(response);
      
      // Actualizar las URLs de paginación
      this.nextUrl = response.data.next;
      this.previous = response.data.previous;
      
      // Iteración para crear promesas de cada pokemon
      const pokemonPromises = response.data.results.map((pokemon: any) => {
        return CapacitorHttp.get({url: pokemon.url, params: {}});
      });
      
      // Usar Promise.all() con await para ejecutar todas las consultas concurrentemente
      const pokemonDetails = await Promise.all(pokemonPromises);
      
      // Crear arreglo de pokemons procesados
      const pokemons: IPokemon[] = [];
      
      pokemonDetails.forEach((pokemonResponse: HttpResponse) => {
        const pokemon = this.processPokemon(pokemonResponse.data);
        pokemons.push(pokemon);
      });
      
      console.log("Pokemon procesados:", pokemons);
      console.log("Next URL:", this.nextUrl);
      return pokemons;
    }
    return null;
  }

  getPokemon(id: number) {
    // se debe formar una ruta como:
    // https://pokeapi.co/api/v2/pokemon/:id
    const ruta = `${this.baseUrl}${this.pokemonEndpoint}/${id}`;
    return CapacitorHttp.get({ url: ruta, params: {} })
      .then((resp: HttpResponse) => this.processPokemon(resp.data));
  }

}