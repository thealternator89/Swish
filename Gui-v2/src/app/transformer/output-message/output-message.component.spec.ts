import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputMessageComponent } from './output-message.component';

describe('OutputMessageComponent', () => {
  let component: OutputMessageComponent;
  let fixture: ComponentFixture<OutputMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
