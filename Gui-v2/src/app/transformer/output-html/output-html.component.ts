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
    return this.sanitizer.bypassSecurityTrustHtml(this.deLinkify(html));
  }

  /**
   * Replaces all anchor tags with span tags in the given html string.
   * This is so that the links are not clickable in the output.
   * @param htmlString The html string to be de-linkified
   * @returns A HTML string with all the links replaced with spans
   */
  private deLinkify(htmlString: string): string {
    var regex = /<a\b([^>]*)>(.*?)<\/a>/gi;
    var replacedHtml = htmlString.replace(regex, '<span $1>$2</span>');
    return replacedHtml;
  }
}
