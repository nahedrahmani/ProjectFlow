import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    console.log('Signing out - clearing localStorage');
    localStorage.clear();
  }

  public saveToken(token: string): void {
    console.log('Saving token:', token);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Token saved. Verification:', localStorage.getItem(TOKEN_KEY));
  }

  public getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Getting token from localStorage:', token);
    return token;
  }

  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const loggedIn = this.getToken() !== null;
    console.log('isLoggedIn check:', loggedIn);
    return loggedIn;
  }
}