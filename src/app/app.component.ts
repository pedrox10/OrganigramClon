import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatNavList} from "@angular/material/list";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OrganigramClon';
}
