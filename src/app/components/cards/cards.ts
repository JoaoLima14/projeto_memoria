import { Component, signal, WritableSignal  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css'
})
export class Cards {
  cardClicked = false;
  numberOfCards = 10;
  cardStates: WritableSignal<boolean>[] = Array.from(
  { length: this.numberOfCards },
  () => signal(false));
  selectedCards: number[] = [];
onCardClick(index: number) {
  if (this.selectedCards.length === 2) {
      return;
    }

  if (this.cardStates[index]()) {
      return;
  }
  const current = this.cardStates[index]();
  this.cardStates[index].set(!current);
}

 }
