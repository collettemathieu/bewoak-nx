import { TestBed, waitForAsync } from '@angular/core/testing';
import { ApiCrossRefModule } from './api-cross-ref.module';

describe('ApiCrossRefModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ApiCrossRefModule],
      }).compileComponents();
    }),
  );

  it('should create', () => {
    expect(ApiCrossRefModule).toBeDefined();
  });
});
