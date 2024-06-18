import { Prisma } from "@prisma/client";

export const UserExtension = Prisma.defineExtension({
  name: "UserExtension",
  result: {
    user: {
      fullName: {
        needs: { name: true },
        compute(user) {
          return `hello ${user.name}`;
        },
      },
    },
  },
  query: {
    // user: {
    //   create: ({ args, query }) => {
    //     const fullName = getFullName(args.data.firstName, args.data.lastName);
    //     args.data.fullName = fullName;
    //     return query(args);
    //   },
    //   update: ({ args, query }) => {
    //     if (args.data.firstName && args.data.lastName) {
    //       const fullName = getFullName(args.data.firstName as string, args.data.lastName as string);
    //       args.data.fullName = fullName;
    //     }
    //     return query(args);
    //   },
    // },
  },
});

// const getFullName = (firstName: string | null | undefined, lastName: string | null | undefined) => {
//   let fullName = "";
//   if (firstName) fullName += firstName;
//   if (lastName) {
//     if (fullName) fullName += " ";
//     fullName += lastName;
//   }
//   return fullName;
// };
