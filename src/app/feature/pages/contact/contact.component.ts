import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environmets.mapbox';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapContainer!: ElementRef;
  map!: mapboxgl.Map;

  constructor() { }

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-76.56177339999999, 2.4832482],
      zoom: 15
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker()
      .setLngLat([-76.56177339999999, 2.4832482])
      .addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map.remove();
  }

}