import httpService from './../services/HttpService';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Note {
    id: number;
    folderId: number;
    title: string;
}

class NoticeRepository {
    baseUrl = 'notices';
    notes$: BehaviorSubject<any> = new BehaviorSubject([]); // cached notices

    createNotice(note: any): Observable<any> {
        return httpService.post(this.baseUrl, {
            ...note,
            directoryId: note.folderId
        }).pipe(
            map(result => Object({...note, id: result.id}))
        )
    }

    // getting list of all notices through api
    fetchNotices = () => {
        return httpService.get(this.baseUrl, {}).pipe(
            map(items => {
                return items.map((item: any) => Object({...item, folderId: item.directoryId}))
            }),
            tap(notes => this.notes$.next(notes))
        )
    };

    // getting list of notices're belonging to the folder
    getNotices(folderId: number, useCache = true): Observable<Note[]> {
        const allNotes$ = useCache && this.notes$.value.length > 0 ? this.notes$ : this.fetchNotices();

        return allNotes$.pipe(
            map(notes => {
                return notes.filter((note: Note) => note.folderId === folderId);
            }),
        )
    }

    deleteNotice(id: number): Observable<any> {
        return httpService.delete(`${this.baseUrl}/${id}`)
    }

    editNotice(note: Note): Observable<Note> {
        return httpService.put(`${this.baseUrl}/${note.id}`, {
            ...note,
            directoryId: note.folderId
        })
    }
}

export default new NoticeRepository();