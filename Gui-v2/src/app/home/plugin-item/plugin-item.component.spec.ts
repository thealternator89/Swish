import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginItemComponent } from './plugin-item.component';

describe('PluginItemComponent', () => {
  let component: PluginItemComponent;
  let fixture: ComponentFixture<PluginItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
