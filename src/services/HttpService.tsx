import { ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class HttpService {
    BASE_URL = process.env.REACT_APP_BASE_URL;

    get(url: string, params: object): Observable<any> {
        return ajax.get(`${this.BASE_URL}/${url}`, params).pipe(map(result => result.response));
    }

    post(url: string, data: object): Observable<any> {
        return ajax.post(`${this.BASE_URL}/${url}`, data, {
            'Content-Type': 'application/json'
        }).pipe(map(result => result.response));
    }

    put(url: string, data: object): Observable<any> {
        return ajax.put(
            `${this.BASE_URL}/${url}`,
            data, {
                'Content-Type': 'application/json'
            }
        ).pipe(map(result => result.response));
    }

    delete(url: string): Observable<any> {
        return ajax.delete(`${this.BASE_URL}/${url}`).pipe(map(result => result.response));
    }
}

export default new HttpService();