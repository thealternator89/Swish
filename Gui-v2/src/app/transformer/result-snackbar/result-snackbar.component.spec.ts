import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSnackbarComponent } from './result-snackbar.component';

describe('ResultSnackbarComponent', () => {
  let component: ResultSnackbarComponent;
  let fixture: ComponentFixture<ResultSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
