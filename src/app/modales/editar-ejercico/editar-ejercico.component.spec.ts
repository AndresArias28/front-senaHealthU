import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEjercicoComponent } from './editar-ejercico.component';

describe('EditarEjercicoComponent', () => {
  let component: EditarEjercicoComponent;
  let fixture: ComponentFixture<EditarEjercicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEjercicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEjercicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
