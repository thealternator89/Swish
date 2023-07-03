import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-output-markdown',
  templateUrl: './output-markdown.component.html',
  styleUrls: ['./output-markdown.component.scss']
})
export class OutputMarkdownComponent implements OnInit {

  theme: 'light'|'dark' = 'light';

  @Input()
  outputText: string;

  constructor(config: ConfigService) {
    config.onColorModeChanged().subscribe((mode) => {
      this.theme = mode;
    });
    this.theme = config.colorMode;
  }

  ngOnInit(): void {
  }

}
