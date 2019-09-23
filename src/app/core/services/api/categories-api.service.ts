import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { CategoryNode } from '../../../shared/components/categories-tree/CategoryNode';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  createNode(node: CategoryNode[]): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/categories`, node).toPromise();
  }

  getCategoryNode(id?: string): Promise<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/categories${id ? `/${id}/tree` : ''}`).toPromise();
  }

  updateCategoryNode(id: string, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/${id}/tree`, node).toPromise();
  }

  getNode(id?: string): Promise<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/tree${id ? `/${id}` : ''}`).toPromise();
  }

  addNode(id: string, nodeList: CategoryNode[]): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/tree/${id}`, nodeList).toPromise();
  }

  updateNode(id: string, nodeList: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/tree/${id}`, nodeList).toPromise();
  }

  deleteNode(id: string): Promise<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/tree/${id}`).toPromise();
  }
}
