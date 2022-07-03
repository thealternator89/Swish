import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomPluginComponent } from './edit-custom-plugin.component';

describe('EditCustomPluginComponent', () => {
  let component: EditCustomPluginComponent;
  let fixture: ComponentFixture<EditCustomPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCustomPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCustomPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
