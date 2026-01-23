import { Router, Request, Response } from "express";
import sessionToken from "../Auth/jwt";
import command from "../Controllers/command";
import Database from "../Database/database";

const router = Router();

// send a command request
router.post("/", async (req: Request, res: Response) => {
  const commandOBJ = new command();
  const result = await commandOBJ.getCommandFromID(req.body.commandID)
  if (result === false){
    res.sendStatus(500)
  }

  commandOBJ.executeCommand();
  res.sendStatus(200);
});

// retrieve a command's info
router.get("/", async (req: Request, res: Response) => {
  const commandOBJ = new command();
  const result = await commandOBJ.getCommandFromID(req.body.commandID)
  if (result === false){
    res.send(500);
  }

  res.status(200).send({
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
router.delete("/", async (req: Request, res: Response) => {
  const commandOBJ = new command();
  const result = await commandOBJ.getCommandFromID(req.body.commandID)
  if (result === false){
    res.send(500);
  }

  // not awaited, allow server to delete when easiest
  commandOBJ.deleteCommand();
  res.sendStatus(200)
});

// create a new command
router.put("/", async (req: Request, res: Response) => {
  res.sendStatus(501);
});

export default router;
