import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterExerciseComponent } from './register-exercise.component';

describe('RegisterExerciseComponent', () => {
  let component: RegisterExerciseComponent;
  let fixture: ComponentFixture<RegisterExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterExerciseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
