import { Prisma } from "@prisma/client";
import { AwsS3Service } from "nestlibs-aws-s3";

const _s3 = new AwsS3Service({
  prefix: process.env["AWS_S3_BUCKET_PREFIX"],
  region: process.env["AWS_REGION"] || "",
  accessKeyId: process.env["AWS_ACCESS_KEY_ID"] || "",
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] || "",
  bucketName: process.env["AWS_S3_BUCKET"] || "",
});

export const S3UrlExtension = Prisma.defineExtension({
  name: "S3UrlExtension",
  result: {
    // customer: {
    //   avatar: {
    //     needs: { avatar: true },
    //     compute(customer) {
    //       if (!customer.avatar) return customer.avatar;
    //       return s3.getFileUrl(customer.avatar);
    //     },
    //   },
    // },
  },
});
