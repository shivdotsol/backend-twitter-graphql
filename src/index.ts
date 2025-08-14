import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import apolloGqlServer from "./graphql/index.js";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());
    app.use("/graphql", expressMiddleware(await apolloGqlServer()));

    app.listen(PORT, () => console.log(`listening on ${PORT}`));
}

init();
