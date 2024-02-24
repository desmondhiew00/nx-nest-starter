import executor from './executor';

describe('PrismaSeed Executor', () => {
  it('can run', async () => {
    const output = await executor();
    expect(output.success).toBe(true);
  });
});
