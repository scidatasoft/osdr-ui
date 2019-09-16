import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { CategoryNode } from '../../../shared/components/categories-tree/CategoryNode';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  getNode(id?: string): Promise<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/tree${id ? `/${id}` : ''}`).toPromise();
  }

  addNode(id: string, tree: CategoryNode[]): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/tree/${id}`, tree).toPromise();
  }

  updateNode(id: string, tree: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/tree/${id}`, tree).toPromise();
  }

  deleteNode(id: string): Promise<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/tree/${id}`).toPromise();
  }
}