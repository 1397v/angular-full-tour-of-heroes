import { Component, OnInit } from '@angular/core';
import { Hero } from '../models/hero';
import { HeroesService } from '../services/heroes.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-heroes', // CSS
  templateUrl: './heroes.component.html', // Location of html -> Template
  styleUrls: ['./heroes.component.css']  // Location of styles file
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  selectedHero: Hero;
  addNewHero: boolean;
  newHeroName: string;

  constructor(private heroesService: HeroesService,
              private messageService: MessagesService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroesService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
    });
  }

  onClickAdd(): void {
    this.addNewHero = true;
  }

  onAddHero(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroesService.addHero({name} as Hero)
      .subscribe(_ => {
        this.getHeroes();
      });
  }

  onDelete(hero: Hero): void {
    this.heroesService.deleteHero(hero).subscribe(_ => {
      this.getHeroes();
    });
  }
}
