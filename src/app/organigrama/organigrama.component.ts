import {Component, AfterViewInit, ViewEncapsulation, ElementRef, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

declare var Treant: any;

@Component({
  selector: 'app-organigrama',
  templateUrl: './organigrama.component.html',
  styleUrls: ['./organigrama.component.css'],
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class OrganigramaComponent implements AfterViewInit {

  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef;

  zoom = 1;
  posX = 0;
  posY = 0;
  dragging = false;
  lastX = 0;
  lastY = 0;
  searchText: string = "";

  ngAfterViewInit(): void {
    this.cargarOrganigrama();
    setTimeout(()=> {
      const rootNode = document.querySelector("#wrapper .node") as HTMLElement;
      this.centrarEnNodo(rootNode);
    }, 900)
    this.activarZoomYPan();
  }

  cargarOrganigrama() {

    const root = {
      text: { name: "SECRETARÍA MUNICIPAL", title: "Lic. JUAN PÉREZ" },
      HTMLclass: "mi-nodo item-nodo",
      children: [
        {
          text: { name: "JEFE DE UNIDAD", title: "Ing. ANA RIVERA" },
          HTMLid: `ana`,
          HTMLclass: "mi-nodo item-nodo",
          children: [
            { text: { name: "TÉCNICO DE REDES", title: "C. LÓPEZ" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "TÉCNICO DE SISTEMAS", title: "JUAN PEREZ" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "TÉCNICO DE DESARROLLO", title: "PEDRO BARCO" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "TÉCNICO DE OPERACIONES", title: "JOSE NINA" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "TÉCNICO DE CATASTRO", title: "MARIA CESPEDES" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "TÉCNICO DE CATASTRO", title: "MARIA CESPEDES" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "TÉCNICO DE CATASTRO", title: "MARIA CESPEDES" }, HTMLclass: "mi-nodo contrato-nodo" },
            { text: { name: "AUXILIAR", title: "R. DÍAZ" }, HTMLclass: "mi-nodo rotacion-nodo" }
          ]
        },
        { text: { name: "CHOFER", title: "M. GÓMEZ" }, HTMLclass: "mi-nodo contrato-nodo" }
      ]
    };

    const chart_config = {
      chart: {
        container: "#wrapper",
        callback: {
          onTreeLoaded: () => {
            const rootNode = document.querySelector("#wrapper .node") as HTMLElement;
            this.centrarEnNodo(rootNode);
          }
        },
        connectors: {
          type: 'step',
          style: { "stroke-width": 2, "stroke": "#ccc" }
        },
        node: { collapsable: true }
      },
      nodeStructure: root
    };

    new Treant(chart_config);
  }

  buscarNodo(texto: string) {
    const nodes = Array.from(document.querySelectorAll('.node')) as HTMLElement[];
    // Limpiar resaltado previo
    nodes.forEach(n => n.classList.remove('highlight'));

    if (!texto.trim()) return;
    const coincidencias: HTMLElement[] = [];
    nodes.forEach(n => {
      const name = n.querySelector('.node-name')?.textContent?.toLowerCase();
      const title = n.querySelector('.node-title')?.textContent?.toLowerCase();

      if (name?.includes(texto.toLowerCase()) || title?.includes(texto.toLowerCase())) {
        n.classList.add('highlight');
        // Abrir los nodos padres de cada coincidencia
        //this.expandirAncestros(n);
        this.expandirNodo("ana")
        coincidencias.push(n);
      }
    });
    // Centrar solo el primer resultado
    if (coincidencias.length > 0) {
      setTimeout(() => {
        this.centrarEnNodo(coincidencias[0]);
      }, 750);
    }
  }

  expandirNodo(id: string) {
    const dom = document.getElementById(id);
    const toggle = dom?.querySelector(".collapse-switch") as HTMLElement;
    if (dom?.classList.contains("collapsed")) {
      toggle?.click();
    }
  }

  expandirAncestros(node: HTMLElement) {
    let current: HTMLElement | null = node;

    while (current) {

      const toggle = current.querySelector('.collapse-switch') as HTMLElement | null;

      // Si el toggle existe y está colapsado
      if (toggle && toggle.classList.contains('collapsed')) {
        console.log("-> Expandir:", current);
        toggle.click();
      }

      // Ahora subimos al padre REAL del organigrama:
      current = this.obtenerPadreTreant(current);
    }
  }

  obtenerPadreTreant(node: HTMLElement): HTMLElement | null {
    // El .children de este nodo es su siguiente hermano
    // El .children del padre es un ancestro que contiene este node
    const childrenContainer = node.closest('.children');

    if (!childrenContainer) return null;

    // El padre es el nodo inmediatamente anterior al contenedor .children
    const parentNode = childrenContainer.previousElementSibling;

    if (parentNode?.classList.contains('node')) {
      return parentNode as HTMLElement;
    }

    return null;
  }


  centrarPrimero() {
    const cont = document.getElementById('organigrama-container');
    if (!cont) return;
    cont.scrollTo({
      left: 200,
      top: 100,
      behavior: "instant"
    });
  }

  centrarEnNodo(node: HTMLElement) {
    console.log("centrando ...")
    const cont = document.getElementById('organigrama-container');
    if (!cont) return;

    const rect = node.getBoundingClientRect();
    const crect = cont.getBoundingClientRect();
    console.log(crect)
    const x = rect.left - crect.left + cont.scrollLeft - cont.clientWidth / 2 + rect.width / 2;
    const y = rect.top - crect.top + cont.scrollTop - cont.clientHeight / 2 + rect.height / 2;
    cont.scrollTo({
      left: x,
      top: y,
      behavior: "smooth"
    });
  }

  activarZoomYPan() {
    const container = this.wrapper.nativeElement;
    // ZOOM (scroll)
    container.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom = Math.min(3, Math.max(0.2, this.zoom + delta));
      container.style.transform = `scale(${this.zoom}) translate(${this.posX}px, ${this.posY}px)`;
    });
    // PAN (arrastrar)
    container.addEventListener('mousedown', (e: MouseEvent) => {
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.posX += dx / this.zoom;
      this.posY += dy / this.zoom;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      container.style.transform = `scale(${this.zoom}) translate(${this.posX}px, ${this.posY}px)`;
    });
    window.addEventListener('mouseup', () => this.dragging = false);
  }

  centerOrganigrama() {
    const container = document.getElementById('organigrama-container')!;
    const wrapper = document.getElementById('wrapper')!;
    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    // tamaño real del organigrama
    const wrapperWidth = wrapperRect.width;
    const wrapperHeight = wrapperRect.height;
    // tamaño visible del contenedor
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    // calcular el offset para centrarlo
    const offsetX = (containerWidth - wrapperWidth) / 2;
    const offsetY = (containerHeight - wrapperHeight) / 2;
    // Aplicar un translate inicial
    wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1)`;
  }
}
