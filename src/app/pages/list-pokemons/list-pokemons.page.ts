
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { LoadingController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { SPokemon } from '../../services/spokemon';
import { IPokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent, CommonModule, FormsModule]
})
export class ListPokemonsPage implements OnInit {

  private pokemonService: SPokemon = inject(SPokemon);
  private loadingController: LoadingController = inject(LoadingController);
  private router: Router = inject(Router);

  //variable para almacenar todos los poquemos en pantalla
  pokemons: IPokemon[] = [];

  constructor() { }

  getTypeImage(type: string): string {
    // Mapeo de tipos de la API a nombres de archivos
    const typeMap: { [key: string]: string } = {
      'grass': 'grass',
      'poison': 'poison', 
      'fire': 'fire',
      'flying': 'flying',
      'water': 'water',
      'bug': 'bug',
      'normal': 'normal',
      'electric': 'electric',
      'ground': 'ground',
      'fairy': 'fairy',
      'fighting': 'fighting',
      'psychic': 'psychic',
      'rock': 'rock',
      'steel': 'steel',
      'ice': 'ice',
      'ghost': 'ghost',
      'dragon': 'dragon',
      'dark': 'dark'
    };
    
    return `assets/img/${typeMap[type] || type}.gif`;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Resetear paginación y pokemones si es la primera vez
    if (this.pokemons.length === 0) {
      this.pokemonService.resetPagination();
    }
    this.getMorePokemons();
  }

  async getMorePokemons(event?: InfiniteScrollCustomEvent) {
    // Verificar si hay más pokemones disponibles
    if (!this.pokemonService.hasMorePokemons()) {
      event?.target.complete();
      return;
    }

    //constante para almacenar la promesa
    const promisePokemons = this.pokemonService.getPokemons();

    if(promisePokemons) { //validando que no sea null
      let loading: any;
      if(!event) {
        //se crea el controlador para el ion-loading
        loading = await this.loadingController.create({
          message: 'Cargando Pokémones...'
        });
        loading.present(); //hace que se muestre el loading
      }
      //Se manda llamar la promesa
      promisePokemons.then(( pokemons: IPokemon[] | null ) => {
        if(pokemons) {
          //El nuevo arreglo de pokemons obtenidos, se
          //concatena con el de la clase interna
          //es decir, los que estaban, mas los nuevos
          this.pokemons = this.pokemons.concat(pokemons);
        }
        
        // Si no hay más pokemones disponibles, deshabilitar el infinite scroll
        if (!this.pokemonService.hasMorePokemons() && event?.target) {
          event.target.disabled = true;
        }
      })
      .catch(( error ) => {
        console.log('Error al cargar pokemones:', error);
        // En caso de error, intentar completar el infinite scroll
        event?.target.complete();
      }) //Si ocurre un error
      .finally(()=>{
        //Bloque que se ejecuta al completar o al tener error
        //asegura que el loading cierre
        loading?.dismiss(); //cierra el loading
        event?.target.complete(); //Se cierra el mensaje del scroll infinito
      });
    } else {
      // Si no hay promesa, completar el infinite scroll
      event?.target.complete();
    }
  }

  goToPage(pokemon: IPokemon) {
    this.router.navigate(['/detail-pokemon', pokemon.id]);
  }

}
