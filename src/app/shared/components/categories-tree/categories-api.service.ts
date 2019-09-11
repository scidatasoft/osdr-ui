import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { CategoryNode } from './CategoryNode';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  getTree(id: string | number): Promise<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/tree/${id}`).toPromise();
  }

  setTree(id: string | number, tree: CategoryNode[]): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/tree/${id}`, tree).toPromise();
  }

  updateTree(id: string | number, tree: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/tree/${id}`, tree).toPromise();
  }

  deleteTree(id: string | number): Promise<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/tree/${id}`).toPromise();
  }
}

/**
 * GET /tree/[{id}]
  Ex: GET /tree, /tree/guid1, /tree/guid2

  POST /tree/[{id}]
  Ex: POST /tree BODY: { title: “Name 1” } -> { id: “newId”, title: “Name 1” }
    sorted alphabetically by title
    POST /tree/{parentGuid} BODY: { title: “Name 1" } -> { id: “newId”, title: “Name 1" }

  PUT /tree/{id}
  Ex: PUT /tree BODY: { title: “New Name 1” } -> { id: “newId”, title: “New Name 1” }
    sorted alphabetically by title

  DELETE /tree/{id}
  Ex: DELETE /tree/{id}

 */
