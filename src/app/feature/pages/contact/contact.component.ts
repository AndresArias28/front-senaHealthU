import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environmets.mapbox';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapContainer!: ElementRef;
  private map: any; // Usamos 'any' porque se importará dinámicamente
  private mapboxgl: any;

  constructor() {}

  ngOnInit(): void {
    // No cargamos mapbox-gl aquí, solo el token si es necesario
  }

  async ngAfterViewInit(): Promise<void> {
    // Importación dinámica (se carga solo cuando el componente se monta)
    const mapbox = await import('mapbox-gl');
    this.mapboxgl = mapbox.default; // Necesario para acceder al objeto principal

    this.mapboxgl.accessToken = environment.mapbox.accessToken;

    // Inicializar mapa
    this.map = new this.mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-76.56177339999999, 2.4832482],
      zoom: 15
    });

    // Controles de navegación
    this.map.addControl(new this.mapboxgl.NavigationControl());

    // Marcador
    new this.mapboxgl.Marker()
      .setLngLat([-76.56177339999999, 2.4832482])
      .addTo(this.map);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
