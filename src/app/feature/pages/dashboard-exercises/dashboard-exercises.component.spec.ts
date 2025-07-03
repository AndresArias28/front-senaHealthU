import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExercisesComponent } from './dashboard-exercises.component';

describe('DashboardExercisesComponent', () => {
  let component: DashboardExercisesComponent;
  let fixture: ComponentFixture<DashboardExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardExercisesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
