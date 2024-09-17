import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SareewisegstCustomerwiseSalesComponent } from './sareewisegst-customerwise-sales.component';

describe('SareewisegstCustomerwiseSalesComponent', () => {
  let component: SareewisegstCustomerwiseSalesComponent;
  let fixture: ComponentFixture<SareewisegstCustomerwiseSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SareewisegstCustomerwiseSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SareewisegstCustomerwiseSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
