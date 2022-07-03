import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleManageComponent } from './module-manage.component';

describe('ModuleManageComponent', () => {
  let component: ModuleManageComponent;
  let fixture: ComponentFixture<ModuleManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
