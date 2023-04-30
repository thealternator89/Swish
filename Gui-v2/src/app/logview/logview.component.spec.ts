import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogviewComponent } from './logview.component';

describe('LogviewComponent', () => {
  let component: LogviewComponent;
  let fixture: ComponentFixture<LogviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
