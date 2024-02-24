import { PrismaResetExecutorSchema } from './schema';
import executor from './executor';

const options: PrismaResetExecutorSchema = {};

describe('PrismaReset Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
