import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRutinaComponent } from './asignar-rutina.component';

describe('AsignarRutinaComponent', () => {
  let component: AsignarRutinaComponent;
  let fixture: ComponentFixture<AsignarRutinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarRutinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarRutinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
