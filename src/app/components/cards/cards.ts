import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Card {
  id: number;       
  image: string;    
  flipped: WritableSignal<boolean>; 
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css'
})
export class Cards {
  numberOfPairs = 10;   
  cards: Card[] = [];
  loading = signal(true);

  constructor(private http: HttpClient) {
    this.loadCards();
  }

  async loadCards() {
    this.loading.set(true);

    const randomIds = new Set<number>();
    while (randomIds.size < this.numberOfPairs) {
      randomIds.add(Math.floor(Math.random() * 898) + 1);
    }

    const pokemons = await Promise.all(
      Array.from(randomIds).map(id =>
        this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise()
      )
    );

    const tempCards: Card[] = [];
    pokemons.forEach((poke, idx) => {
      const image = poke.sprites.front_default || 'assets/images/back.png';

      tempCards.push({
        id: idx * 2,
        image,
        flipped: signal(false)
      });
      tempCards.push({
        id: idx * 2 + 1,
        image,
        flipped: signal(false)
      });
    });

    this.cards = this.shuffleArray(tempCards);

    this.loading.set(false);
  }

  shuffleArray(array: Card[]): Card[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onCardClick(card: Card) {
    const current = card.flipped();
    card.flipped.set(!current);
  }
}
