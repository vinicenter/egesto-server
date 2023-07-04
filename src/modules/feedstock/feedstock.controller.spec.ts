import { Test, TestingModule } from '@nestjs/testing';
import { FeedStockController } from './feedstock.controller';

describe('FeedStockController', () => {
  let controller: FeedStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedStockController],
    }).compile();

    controller = module.get<FeedStockController>(FeedStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
