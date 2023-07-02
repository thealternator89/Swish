import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-output-placeholder',
  templateUrl: './output-placeholder.component.html',
  styleUrls: ['./output-placeholder.component.scss']
})
export class OutputPlaceholderComponent implements OnInit {

  theme: 'light'|'dark' = 'light';

  constructor(config: ConfigService) {
    config.onColorModeChanged().subscribe((mode) => {
      this.theme = mode;
    });
    this.theme = config.colorMode;
  }

  ngOnInit(): void {
  }

}
