import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginResultSnackbarComponent } from './plugin-result-snackbar.component';

describe('PluginResultSnackbarComponent', () => {
  let component: PluginResultSnackbarComponent;
  let fixture: ComponentFixture<PluginResultSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginResultSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginResultSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
