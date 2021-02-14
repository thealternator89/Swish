import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalettePluginItemComponent } from './palette-plugin-item.component';

describe('PalettePluginItemComponent', () => {
  let component: PalettePluginItemComponent;
  let fixture: ComponentFixture<PalettePluginItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalettePluginItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PalettePluginItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
