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
    return this.sanitizer.bypassSecurityTrustHtml(this.modifyLinks(html, "Links have been deactivated."));
  }

  private modifyLinks(htmlString: string, alertMessage: string): string {
    // Regular expression pattern to match anchor tags with href attribute
    var pattern = /<a([^>]+)href\s*=\s*["']([^"']+)["']([^>]*)>/gi;

    // Replace the href attribute with the modified JavaScript code
    var modifiedHTML = htmlString.replace(pattern, `<a$1href="javascript:alert('${alertMessage}')">$3`);

    // Return the modified HTML string
    return modifiedHTML;
  }

}
