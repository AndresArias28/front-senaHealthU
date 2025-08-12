import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { QRCodeComponent,  } from 'angularx-qrcode';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-programador',
  imports: [CommonModule, QRCodeComponent, FormsModule],
  templateUrl: './programador.component.html',
  styleUrl: './programador.component.css'
})
export class ProgramadorComponent {

  mensaje: string = '';
  accion: 'activar' | 'finalizar' = 'activar';
  idDesafio: string = '';
  codigoQR: string = '';

  constructor(private userService: UserService) { }

  descargarQR() {
    
  }

  saveQR() {
    const codigoQR = JSON.stringify({
      accion: this.accion,
      idDesafio: this.idDesafio.trim()
    })

    this.userService.registerQr(codigoQR).subscribe({
      next: (response) => {
        console.log('QR registrado:', response);
        this.mensaje = 'QR registrado exitosamente.';
        setTimeout(() => {
        this.mensaje = '';
      }, 3000);
      },
      error: (error) => {
        console.error('Error al registrar el QR:', error);
        this.mensaje = 'Error al registrar el QR.';
        setTimeout(() => {
        this.mensaje = '';
      }, 3000);
      }
    });
 
  }



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
