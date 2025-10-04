import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  imports: [],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdminComponent {
  @Input() tipoUsuario!: string;
  userLoginOn: boolean = false;
}
