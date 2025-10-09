import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAsignacionComponent } from './gestionar-asignacion.component';

describe('GestionarAsignacionComponent', () => {
  let component: GestionarAsignacionComponent;
  let fixture: ComponentFixture<GestionarAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAsignacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
