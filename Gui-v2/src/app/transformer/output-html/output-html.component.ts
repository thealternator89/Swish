import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss']
})
export class OutputHtmlComponent implements OnInit {

  @Input("outputText")
  outputText: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
