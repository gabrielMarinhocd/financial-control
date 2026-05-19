import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    apiPath: any = environment.ulrApi;

    constructor(private http: HttpClient) {}

    getQuote(ticker: string): Observable<any> {
        return this.http.get<any>(`${this.apiPath}/quote?ticker=${ticker}`);
    }

    getDividends(ticker: string): Observable<any> {
        return this.http.get<any>(`${this.apiPath}/dividends?ticker=${ticker}`);
    }
}
