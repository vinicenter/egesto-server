import { Test, TestingModule } from '@nestjs/testing';
import { FeedStockService } from './feedstock.service';

describe('FeedstockService', () => {
  let service: FeedStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedStockService],
    }).compile();

    service = module.get<FeedStockService>(FeedStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
