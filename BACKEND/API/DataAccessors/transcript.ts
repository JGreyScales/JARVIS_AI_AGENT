import familyObject from "./Families";
import commandObject from "./commands";

enum Action {
    undefined = -1,
    userAction = 0,
    commandAction = 1,
    familyAction = 2,
}

enum ActionType {
    undefined = -1,
    userUpdated = 0,
    userDeleted = 1,
    userCreated = 2,
    commandUpdated = 3,
    commandDeleted = 4,
    commandCreated = 5,
    commandExecuted = 6,
    familyUpdated = 7,
    familyDeleted = 8,
    familyCreated = 9
}

class transcriptObject {
    transcriptID: number;
    transcriptTime: Date;
    action: Action;
    actionType: ActionType;
    invokerID: number;
    familyInvokedInID: familyObject;
    commandInvokedID: commandObject;

    constructor(transcriptID: number = 0,
                transcriptTime: Date = new Date(),
                action: Action = Action.undefined,
                actionType: ActionType = ActionType.undefined,
                invokerID: number = 0,
                familyInvokedInID: familyObject = new familyObject(),
                commandInvokedID: commandObject = new commandObject()
    ) {
        this.transcriptID = transcriptID;
        this.transcriptTime = transcriptTime;
        this.action = action;
        this.actionType = actionType;
        this.invokerID = invokerID;
        this.familyInvokedInID = familyInvokedInID;
        this.commandInvokedID = commandInvokedID;
    }
}

export default transcriptObject