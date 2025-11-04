import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, LoadingController, IonHeader, IonToolbar, IonTitle, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonImg, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonText, IonProgressBar } from '@ionic/angular/standalone';
import { SPokemon } from '../../services/spokemon';
import { IPokemon } from '../../interfaces/pokemon';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, IonContent, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonImg, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonText, IonProgressBar]
})
export class DetailPokemonPage implements OnInit {

  // El router vinculará automáticamente el parámetro de ruta
  @Input() id!: number;

  private servicioPokemon: SPokemon = inject(SPokemon);
  private loadingController: LoadingController = inject(LoadingController);
  private router: Router = inject(Router);
  pokemon!: IPokemon;

  constructor() {
    addIcons({
      closeOutline
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log(`El id es: ${this.id}`);
    this.servicioPokemon.getPokemon(this.id)
      .then((pokemon: IPokemon) => this.pokemon = pokemon);
  }

  goBack() {
    this.router.navigateByUrl('list-pokemons');
  }

  toNumber(value: string): number {
    return parseInt(value);
  }

}
