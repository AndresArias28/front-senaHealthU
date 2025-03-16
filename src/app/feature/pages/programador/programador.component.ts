import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-programador',
  imports: [BsDatepickerModule, FormsModule],
  templateUrl: './programador.component.html',
  styleUrl: './programador.component.css'
})
export class ProgramadorComponent {
  fechaSeleccionada: Date | null = null;
}
