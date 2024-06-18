import path from "path";
import { DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import joi from "joi";

const baseSchema = {
  NODE_ENV: joi.string().valid("development", "production", "test").default("development"),
  PORT: joi.number().default(3000),
  DATABASE_URL: joi.string().required(),
};

const commonSchema = {
  JwtAuth: {
    ACCESS_TOKEN_SECRET: joi.string().required(),
    REFRESH_TOKEN_SECRET: joi.string().required(),
  },
  AwsS3: {
    AWS_REGION: joi.string().required(),
    AWS_ACCESS_KEY_ID: joi.string().required(),
    AWS_SECRET_ACCESS_KEY: joi.string().required(),
    AWS_S3_BUCKET: joi.string().required(),
    AWS_S3_BUCKET_PREFIX: joi.string(),
  },
};

type CommonSchema = keyof typeof commonSchema;
export class EnvConfigModule {
  static forRoot(schema?: Record<string, joi.Schema> | null, common?: CommonSchema[] | CommonSchema): DynamicModule {
    const appName = path.basename(__dirname);

    let mergedSchema = { ...baseSchema };

    if (typeof common === "string") {
      mergedSchema = { ...mergedSchema, ...commonSchema[common] };
    } else if (Array.isArray(common)) {
      for (const key of common) {
        mergedSchema = { ...mergedSchema, ...commonSchema[key] };
      }
    }

    if (schema) {
      mergedSchema = { ...mergedSchema, ...schema };
    }

    return ConfigModule.forRoot({
      envFilePath: [`apps/${appName}/.env`],
      isGlobal: true,
      validationSchema: joi.object(mergedSchema),
    });
  }
}

export default EnvConfigModule;
