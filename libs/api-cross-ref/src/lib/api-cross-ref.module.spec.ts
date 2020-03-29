import { async, TestBed } from '@angular/core/testing';
import { ApiCrossRefModule } from './api-cross-ref.module';

describe('ApiCrossRefModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ApiCrossRefModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ApiCrossRefModule).toBeDefined();
  });
});
