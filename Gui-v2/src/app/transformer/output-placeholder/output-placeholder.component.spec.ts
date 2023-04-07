import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputPlaceholderComponent } from './output-placeholder.component';

describe('OutputPlaceholderComponent', () => {
  let component: OutputPlaceholderComponent;
  let fixture: ComponentFixture<OutputPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
