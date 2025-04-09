import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { QRCodeComponent,  } from 'angularx-qrcode';

@Component({
  selector: 'app-programador',
  imports: [CommonModule, QRCodeComponent, FormsModule],
  templateUrl: './programador.component.html',
  styleUrl: './programador.component.css'
})
export class ProgramadorComponent {

  enviarQR() {//Todo: Implementar la logica para enviar el QR al backend
  
    throw new Error('Method not implemented.');
  }

  descargarQR() {
    
  }

  imprimirQR() {
  throw new Error('Method not implemented.');
  }

  accion: 'activar' | 'finalizar' = 'activar';
  idDesafio: string = '';
  codigoQR: string = '';

  generarQR() {
    if (this.idDesafio.trim()) {
      // generar el codigo QR en formato JSON y asignarlo a la variable codigoQR
      this.codigoQR = JSON.stringify({
        accion: this.accion,
        idDesafio: this.idDesafio.trim()
      });
    } else {
      alert('Por favor escribe un ID de desafío.');
    }
  }

}
