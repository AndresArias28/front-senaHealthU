import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSuperusuarioComponent } from './dashboard-superusuario.component';

describe('DashboardSuperusuarioComponent', () => {
  let component: DashboardSuperusuarioComponent;
  let fixture: ComponentFixture<DashboardSuperusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSuperusuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSuperusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
