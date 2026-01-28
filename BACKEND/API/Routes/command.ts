import { Router, Request, Response } from "express";
import sessionToken from "../Auth/jwt";
import command from "../Controllers/command";
import commandsObject from "../DataAccessors/commands";

const router = Router();

// send a command request
router.post("/", async (req: Request, res: Response) => {
  const commandInstance = new command();
  const result = await commandInstance.getCommandFromID(req.body.commandID)
  if (result === false){
    res.sendStatus(500)
  }

  commandInstance.executeCommand();
  res.sendStatus(200);
});

// retrieve a command's info
router.get("/", async (req: Request, res: Response) => {
  const commandInstance = new command();
  const result = await commandInstance.getCommandFromID(req.body.commandID)
  if (result === false){
    res.send(500);
  }

  res.status(200).send({
    'commandID': commandInstance.commandObj.commandID,
    'commandName': commandInstance.commandObj.commandName,
    'commandExeuction': commandInstance.commandObj.commandExecution,
    'created_at': commandInstance.commandObj.created_at,
    'updated_at': commandInstance.commandObj.updated_at,
  });
});

// update a command
router.patch("/", async (req: Request, res: Response) => {

  const commandInstance = new command();
  const result = await commandInstance.getCommandFromID(req.body.commandID);
  if (result == false) {
    res.send(500);
  }
  const commandOBJ = new commandsObject(0, req.body.commandName, req.body.commandExecution)
  await commandInstance.updateCommand(commandOBJ);
  res.send(200);
});

// delete a command
router.delete("/", async (req: Request, res: Response) => {
  const commandInstance = new command();
  const result = await commandInstance.getCommandFromID(req.body.commandID)
  if (result === false){
    res.send(500);
  }

  // not awaited, allow server to delete when easiest
  commandInstance.deleteCommand();
  res.sendStatus(200)
});

// create a new command
router.put("/", async (req: Request, res: Response) => {
  const commandInstance = new command( new commandsObject(
    0, 
    req.body.commandName,
    req.body.commandExecution,
  ));

  const token = req.get("Authorization");
  const session = new sessionToken(token);
  await session.verifyData();
  const status = await commandInstance.createCommand(session.familyID)
  if (!status){
    res.sendStatus(501);
  }
  res.sendStatus(200);
});

export default router;
