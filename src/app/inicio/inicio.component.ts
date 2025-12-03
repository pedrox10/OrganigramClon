import {Component, OnInit} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatNavList} from "@angular/material/list";
import {RouterLink, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatNavList, RouterOutlet, RouterLink, MatIcon],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

  }

  toggleSidebar() {
    document.getElementById("sidebar")?.classList.toggle("collapsed");
  }

}
