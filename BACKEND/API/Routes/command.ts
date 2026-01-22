import { Router, Request, Response } from "express";
import sessionToken from "../Auth/jwt";
import command from "../Controllers/command";
import Database from "../Database/database";

const router = Router();

// send a command request
router.post("/", (req: Request, res: Response) => {
  res.sendStatus(501); // Not implemented
});

// retrieve a command's info
router.get("/", async (req: Request, res: Response) => {
  const commandOBJ = new command();
  const result = await commandOBJ.getCommandFromID(req.body.commandID)
  if (result === false){
    res.send(500);
  }

  res.send({
    'commandID': commandOBJ.commandObj.commandID,
    'commandName': commandOBJ.commandObj.commandName,
    'commandExeuction': commandOBJ.commandObj.commandExecution,
    'created_at': commandOBJ.commandObj.created_at,
    'updated_at': commandOBJ.commandObj.updated_at,
  });
});

// update a command
router.patch("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// delete a command
router.delete("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// create a new command
router.put("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

export default router;
