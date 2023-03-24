import { TestBed } from '@angular/core/testing';

import { PluginDataTransferService } from './plugin-data-transfer.service';

describe('PluginDataTransferService', () => {
  let service: PluginDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PluginDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
