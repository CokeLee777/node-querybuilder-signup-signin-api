import * as path from "path";
import dotenv from "dotenv"; //It must be imported before express
dotenv.config({
    path: path.resolve(__dirname, `env/${process.env.NODE_ENV}.env`)
})
import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan";

import usersController from "./users/users.controller";

const app = express();

//Content-Type: application/json
app.use(express.json());
//로그 수준 설정
if(process.env.NODE_ENV === "prod"){
    app.use(morgan("common"));
} else {
    app.use(morgan("dev"));
}

app.use("/api/users", usersController);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    return response.status(404).send("Page Not Found!");
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on ${process.env.SERVER_PORT}`);
});

export default app;