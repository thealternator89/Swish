import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputHtmlComponent } from './output-html.component';

describe('OutputHtmlComponent', () => {
  let component: OutputHtmlComponent;
  let fixture: ComponentFixture<OutputHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
