import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private apiUrl = 'rgqkgl.api.infobip.com';
  private authorizationToken =
    '0e32ff8878aaa1cf5d68c70c396e29ec-92ed9974-4d1c-4c4c-a22c-f2c303a60660'; // Remplacez par votre jeton d'autorisation

  constructor(private http: HttpClient) {}

  sendSms(destination: string, message: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.authorizationToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const payload = {
      messages: [
        {
          destinations: [
            {
              to: destination,
            },
          ],
          from: 'Traking ISJ',
          text: message,
        },
      ],
    };

    return this.http.post(this.apiUrl, payload, { headers });
  }
}
