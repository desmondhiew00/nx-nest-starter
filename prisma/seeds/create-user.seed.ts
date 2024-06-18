import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import signale from "signale";

const prisma = new PrismaClient();
async function main() {
  const email = "user001@test.com";
  const password = "1234";
  const passwordHash = await bcrypt.hash("1234", 10);

  const isExits = await prisma.user.findFirst({ where: { email } });
  if (isExits) {
    signale.error(`User already exists. Email: ${email}`);
    return;
  }

  await prisma.user.create({
    data: {
      name: "User 001",
      email,
      password: passwordHash,
    },
  });
  signale.info(`User created. Email: ${email}, Password: ${password}`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    signale.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
