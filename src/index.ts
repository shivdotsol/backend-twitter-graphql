import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { prismaClient } from "./lib/db.js";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello: String
                say(name: String): String
            }
            type Mutation{
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello from apollo gqpl",
                say: (_, { name }: { name: string }) => `Hello ${name}`,
            },
            Mutation: {
                createUser: async (
                    _,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        password: string;
                    }
                ) => {
                    await prismaClient.user.create({
                        data: {
                            email,
                            firstName,
                            lastName,
                            password,
                            salt: "placeholder_salt",
                        },
                    });
                },
            },
        },
    });

    await gqlServer.start();

    app.use(express.json());
    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => console.log(`listening on ${PORT}`));
}

init();
