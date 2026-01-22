import { Router, Request, Response } from "express";
import sessionToken from "../Auth/jwt";
import command from "../Controllers/command";

const router = Router();

// send a command request
router.post("/", (req: Request, res: Response) => {
  res.sendStatus(501); // Not implemented
});

// retrieve a command's info
router.get("/", async (req: Request, res: Response) => {
  const session = new sessionToken(req.get("authorization"))
  const validToken = await session.verifyData()
  if (!validToken){
    res.sendStatus(401);
  }

  const commandOBJ = new command(Number(req.get('commandID')));
  res.send({
    'commandID': commandOBJ.commandObj.commandID,
    'commandName': commandOBJ.commandObj.commandName,
    'commandExeuction': commandOBJ.commandObj.commandExecution,
    'created_at': commandOBJ.commandObj.created_at,
    'updated_at': commandOBJ.commandObj.updated_at,
  }).sendStatus(200);
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
