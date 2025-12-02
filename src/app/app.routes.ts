import { Routes } from '@angular/router';
import {FuncionariosComponent} from "./funcionarios/funcionarios.component";
import {AppComponent} from "./app.component";
import {InicioComponent} from "./inicio/inicio.component";
import {OrganigramaComponent} from "./organigrama/organigrama.component";

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent, // <--- AQUÍ EL LAYOUT
    children: [
      {
        path: 'funcionarios',
        component: FuncionariosComponent
      },
      {
        path: 'organigrama',
        component: OrganigramaComponent
      },
      {
        path: '',
        redirectTo: 'funcionarios',
        pathMatch: 'full'
      }
    ]
  }
];
