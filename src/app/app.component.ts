import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { NgxSonnerToaster } from 'ngx-sonner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgxSonnerToaster, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gym-sena';
  showHeader = true;
  showBackButton = false;
  

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showHeader = this.router.url !== '/iniciar-sesion'; // Oculta el header si la ruta es "/login"
      this.showBackButton = this.router.url === '/sobre-nosotros' || this.router.url === '/contacto';
    });
  }

  esLogin(): boolean {
    const rutaActual = this.router.url;
    return rutaActual.includes('iniciar-sesion'); // 👈 cambia según tu ruta
  }
}
  