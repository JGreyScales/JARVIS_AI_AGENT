import commandsObject from "../DataAccessors/commands";
import familyObject from "../DataAccessors/Families";

class family {
    commands: commandsObject[];
    family: familyObject = new familyObject();

    constructor(familyID: number, testing: boolean = false) {
        this.commands = this.getCommands();
        const result: Promise<Boolean> = this.family.getFamilyFromID(familyID);
    }

    private getCommands(): commandsObject[] {
        return []
    }

    getCommand(queryCommandName: string): commandsObject | undefined {
        const result: commandsObject | undefined = this.commands.find(({ commandName }) => commandName === queryCommandName);
        if (result === undefined) {
            console.log("Command is undefined");
        }
        return result;
    }

}

export default family