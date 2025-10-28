import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirección por defecto al listado
  {
    path: '',
    redirectTo: 'list-pokemons',
    pathMatch: 'full'
  },
  // Página principal de la lista
  {
    path: 'list-pokemons',
    loadComponent: () => import('./pages/list-pokemons/list-pokemons.page').then(m => m.ListPokemonsPage)
  },
  // Página de detalle con parámetro dinámico :id
  {
    path: 'detail-pokemon/:id',
    loadComponent: () => import('./pages/detail-pokemon/detail-pokemon.page').then(m => m.DetailPokemonPage)
  },
  // Si el usuario intenta acceder a /detail-pokemon sin id, lo redirige a la lista
  {
    path: 'detail-pokemon',
    redirectTo: 'list-pokemons',
    pathMatch: 'full'
  },
];
