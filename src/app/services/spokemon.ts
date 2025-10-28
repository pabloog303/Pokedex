import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SPokemon {

  // URL base de la API Pokemon (solo lectura)
  private readonly baseUrl = 'https://pokeapi.co/api/v2/';
  private readonly pokemonEndpoint = 'pokemon';

  // Variables para manejar la paginación
  public nextUrl: string | null = null;
  public previous: string | null = null;
  public current: string = `${this.pokemonEndpoint}?limit=5&offset=0`;

  constructor() { }

  async getPokemons() {
    if(this.nextUrl) {
      const response = await CapacitorHttp.get({url:this.nextUrl, params:{}});
      console.log("La respuesta es: ");
      console.log(response);
      
      // Iteración para crear promesas de cada pokemon
      const pokemonPromises = response.data.results.map((pokemon: any) => {
        return CapacitorHttp.get({url: pokemon.url, params: {}});
      });
      
      // Usar Promise.all() con await para ejecutar todas las consultas concurrentemente
      const pokemonDetails = await Promise.all(pokemonPromises);
      
      console.log("Detalles de todos los pokemon:", pokemonDetails);
      return pokemonDetails;
    }
    return null;
  }

}