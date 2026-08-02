import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment.prod';
import { PromptActionFuncionalities } from '../../models/prompt-action-funcionalities';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  apiPath: any = environment.ulrApi;

  constructor(private readonly http: HttpClient) {}

  getQuote(ticker: string): Observable<any> {
    return this.http.get<any>(`${this.apiPath}/quote?ticker=${ticker}`);
  }

  getDividends(ticker: string): Observable<any> {
    return this.http.get<any>(`${this.apiPath}/dividends?ticker=${ticker}`);
  }

  transcriptionAudio(
    formData: FormData
  ): Observable<PromptActionFuncionalities> {
    return this.http.post<PromptActionFuncionalities>(
      environment.urlIaAPi + '/api/v1/ai/transcription',
      formData
    );
  }
}
