import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPluginsComponent } from './custom-plugins.component';

describe('CustomPluginsComponent', () => {
  let component: CustomPluginsComponent;
  let fixture: ComponentFixture<CustomPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPluginsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
