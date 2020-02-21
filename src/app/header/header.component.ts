import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy  {
  isAuthentication = false;
  private sub: Subscription;

  constructor( 
    private dataStorageService: DataStorageService,
    private authServ: AuthService,
    private router: Router) {}


  ngOnInit() {
    this.sub = this.authServ.user.subscribe(param => {
      this.isAuthentication = !!param;
    })
  }
 
  onSaveData() {
    this.dataStorageService.storeRecipes()
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe()
    console.log('sub daichira es:' + this.dataStorageService.fetchRecipes())
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  onLogout() {
    this.authServ.logout()
    this.router.navigate(['/auth'])
  }





}
