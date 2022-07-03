import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadedPlugin, PluginResult } from 'swish-base';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = `/api`;

  constructor(private http: HttpClient) {}

  searchPlugins(keyword: string): Observable<LoadedPlugin[]> {
    const query = keyword ? '?q=' + encodeURIComponent(keyword) : '';
    return this.http.get<LoadedPlugin[]>(`${this.apiUrl}/plugin${query}`);
  }

  listCustomPlugins(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/customplugin`);
  }

  getCustomPluginContent(filename: string): Observable<string> {
    return this.http.get(
      `${this.apiUrl}/customplugin/${encodeURIComponent(filename)}`,
      { responseType: 'text' }
    );
  }

  createCustomPlugin(filename: string, definition: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/customplugin`, definition, {
      headers: { 'X-File-Name': filename },
    });
  }

  overwriteCustomPlugin(
    filename: string,
    definition: string
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/customplugin/${encodeURIComponent(filename)}`,
      definition
    );
  }

  deleteCustomPlugin(filename: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/customplugin/${encodeURIComponent(filename)}`
    );
  }

  listInstalledModules(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/module`);
  }

  installModule(moduleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/module/install`, moduleName);
  }

  uninstallModule(moduleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/module/uninstall`, moduleName);
  }
}
