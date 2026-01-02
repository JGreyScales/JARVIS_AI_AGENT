import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import user from "./Routes/user";
import frame from "./Routes/frame";
import family from "./Routes/family";
import command from "./Routes/command";


dotenv.config(); // load the .env file into memory

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: "*", // Allow all origins
};

app.use(cors(corsOptions));
app.use(express.json()); // use json for incoming payloads

app.use("/user", user);
app.use("/family", family);
app.use("/frame", frame);
app.use("/command", command);

app.use(
  "/status",
  express.Router().get("/", (req: Request, res: Response) => {
    res.status(200).send("API Online");
  })
);

const PORT: number = Number(process.env.PORT) || 8000;

// listen on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
