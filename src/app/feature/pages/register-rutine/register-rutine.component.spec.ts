import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRutineComponent } from './register-rutine.component';

describe('RegisterRutineComponent', () => {
  let component: RegisterRutineComponent;
  let fixture: ComponentFixture<RegisterRutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRutineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
