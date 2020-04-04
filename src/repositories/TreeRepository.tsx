import httpService from './../services/HttpService';
import {Observable, forkJoin} from 'rxjs';

interface DataItem {
    id: number;
    name: string;
    parentId: number;
}

class TreeRepository {
    baseUrl = 'directories';

    fetchFolders() {
        return new Observable(observer => {
            httpService.get('directories', {}).subscribe(items => {
                if (items.length <= 1) {
                    // if tree is empty - create couple of folders
                    forkJoin(
                        this.createFolder(1, 'Studing'),
                        this.createFolder(1, 'Hobbies')
                    ).subscribe(_items => {
                        observer.next(items.concat(_items))
                    });
                } else {
                    observer.next(items)
                }
            }, () => observer.error(`Error fetching folders`))
        });
    }

    createFolder(parentId: number, name: string): Observable<DataItem> {
        return httpService.post(this.baseUrl, {parentId, name});
    }

    editFolder(folder: any): Observable<Node> {
        return httpService.put(`${this.baseUrl}/${folder.id}`, {
            id: folder.id,
            parentId: folder.parentId,
            name: folder.name
        })
    }

    deleteFolder(folderId: number): Observable<any> {
        return httpService.delete(`${this.baseUrl}/${folderId}`)
    }
}

export default new TreeRepository();