import executor from "./executor";
import { GeneratedGqlParserExecutorSchema } from "./schema";

const options: GeneratedGqlParserExecutorSchema = {};

describe("GeneratedGqlParser Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
