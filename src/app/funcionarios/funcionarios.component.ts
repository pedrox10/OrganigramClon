import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatBadgeModule} from "@angular/material/badge";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatBadgeModule,
    MatCard,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatHeaderCellDef,
    MatRow,
    MatRowDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatCell
  ],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.scss'
})

export class FuncionariosComponent implements OnInit {
  displayedColumns = ['nombre', 'ci', 'telefono', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarFuncionarios();
  }

  cargarFuncionarios() {
    const url = 'http://190.181.22.149:3310/funcionario';

    this.http.get<any[]>(url, {
      headers: {
        'X-Access-Code': 'ga8f0051d6ff90ff485359f626060aa0fe38fc2c451c184f337ae146e4cd7eefcb8497011ee63534e4afd7eedf65fc1d9017f67c2385bc85b392b862a7bedfd6g'
      }
    }).subscribe({
      next: data => this.dataSource.data = data,
      error: err => console.error('Error cargando funcionarios:', err)
    });
  }

  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  nuevoFuncionario() {
    console.log("Nuevo funcionario");
  }

  editar(f: any) {
    console.log("Editar", f);
  }

  eliminar(f: any) {
    console.log("Eliminar", f);
  }
}
