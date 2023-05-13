import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputCodeComponent } from './output-code.component';

describe('OutputCodeComponent', () => {
  let component: OutputCodeComponent;
  let fixture: ComponentFixture<OutputCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
