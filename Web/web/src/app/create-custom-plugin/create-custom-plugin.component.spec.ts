import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomPluginComponent } from './create-custom-plugin.component';

describe('CreateCustomPluginComponent', () => {
  let component: CreateCustomPluginComponent;
  let fixture: ComponentFixture<CreateCustomPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCustomPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
