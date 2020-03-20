import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Hero } from '../models/hero';
import { HEROES } from '../mock-heroes';
import { MessagesService } from './messages.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HeroesService {

    // private heroes = new BehaviorSubject<Hero[]>(HEROES);
    // currentHeroes = this.heroes.asObservable();
    private heroesUrl = 'api/heroes';  // URL to web api

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
                private messageService: MessagesService) { }

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(_ => this.log('fetched heroes')),
                catchError(this.handleError<Hero[]>('getHeroes', []))
            );
    }

    /** GET hero by id. Will 404 if id not found */
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    updateHero(hero: Hero): Observable<any> {
        return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions)
            .pipe(
                tap(_ => this.log(`updated hero ${hero.name}`)),
                catchError(this.handleError<Hero>('updateHero'))
            );
    }

    addHero(hero: Hero): Observable<any> {
        return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
            .pipe(
                tap(_ => this.log(`added new hero ${hero.name}`)),
                catchError(this.handleError<Hero>('addHero'))
            );
        // this.heroes.value.push(hero);
        // this.log(`HeroesService: added ${hero.toString()}`);
        //this.heroes.next(this.heroes.value); // No hace falta emitir porque la variable está bindeada.
    }

    deleteHero(hero: Hero | number): Observable<any> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;

        return this.http.delete<Hero>(url, this.httpOptions)
            .pipe(
                tap(_ => this.log(`deleted hero ${typeof hero === 'number' ? "with id" + hero : hero.name}`)),
                catchError(this.handleError<Hero>('deleteHero'))
            );
        // this.heroes.value.splice(this.heroes.value.indexOf(hero), 1);
        // this.log(`HeroesService: removed ${hero.toString()}`);
        //this.heroes.next(this.heroes.value);
    }

    /* GET heroes whose name contains search term */
    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            return of([]); // if not search term, return empty hero array.
        }
        return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(x => x.length ?
                this.log(`found heroes matching "${term}"`) :
                this.log(`no heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
