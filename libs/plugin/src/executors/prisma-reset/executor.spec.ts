import executor from './executor';
import { PrismaResetExecutorSchema } from './schema';

const options: PrismaResetExecutorSchema = {};

describe('PrismaReset Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
