import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello: String
                say(name: String): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello from apollo gqpl",
                say: (_, { name }: { name: string }) => `Hello ${name}`,
            },
        },
    });

    await gqlServer.start();

    app.use(express.json());
    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => console.log(`listening on ${PORT}`));
}

init();
