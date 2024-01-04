import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private elasticEmailApiUrl = 'https://api.elasticemail.com/v2/email/send';

  constructor(private http: HttpClient) {}

  sendEmail(emailData: any) {
    // You may need to replace 'YOUR_ELASTIC_EMAIL_API_KEY' with your actual API key
    const apiKey =
      '3A27CE0B50A11DFF041B38689314D36BF1410C27FC5E336F3520CEBF48DCF229D2898413F9E4206652BC87EEE64F7039';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const params = new URLSearchParams();
    params.set('apikey', apiKey);
    params.set('to', emailData.to);
    params.set('subject', emailData.subject);
    params.set('body', emailData.body);
    params.set('from', emailData.from);

    return this.http.post(this.elasticEmailApiUrl, params.toString(), {
      headers,
    });
  }
}
