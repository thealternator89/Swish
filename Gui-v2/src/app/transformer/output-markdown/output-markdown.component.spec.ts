import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputMarkdownComponent } from './output-markdown.component';

describe('OutputMarkdownComponent', () => {
  let component: OutputMarkdownComponent;
  let fixture: ComponentFixture<OutputMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputMarkdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
