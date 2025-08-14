import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import apolloGqlServer from "./graphql/index.js";
import UserService from "./services/user.js";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());
    app.use(
        "/graphql",
        expressMiddleware(await apolloGqlServer(), {
            context: async ({ req }) => {
                const token = req.headers.authorization;
                if (token) {
                    try {
                        const user = UserService.verifyAuthToken(token);
                        return { user };
                    } catch {
                        return {};
                    }
                }
            },
        })
    );

    app.listen(PORT, () => console.log(`listening on ${PORT}`));
}

init();
