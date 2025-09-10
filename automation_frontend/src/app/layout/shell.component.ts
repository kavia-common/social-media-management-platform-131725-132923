import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar.component';
import { TopbarComponent } from '../shared/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <div class="main">
        <app-topbar></app-topbar>
        <div class="container" style="padding-top:1rem;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class ShellComponent {}
