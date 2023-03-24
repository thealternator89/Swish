import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavPluginItemComponent } from './fav-plugin-item.component';

describe('FavPluginItemComponent', () => {
  let component: FavPluginItemComponent;
  let fixture: ComponentFixture<FavPluginItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavPluginItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavPluginItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
