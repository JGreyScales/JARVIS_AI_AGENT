import familyObject from "../DataAccessors/Families";
import UserObject from "../DataAccessors/User";
import commandsObject from "../DataAccessors/commands";


class command {
    commands: commandsObject[];
    user: UserObject;
    family: familyObject;

    constructor(user: UserObject, family: familyObject) {
        this.commands = this.getCommands();
        this.user = user;
        this.family = family;
    }

    private getCommands(): commandsObject[] {
        return []
    }

    getCommand(queryCommandName: string): commandsObject | undefined {
        const result: commandsObject | undefined = this.commands.find(({ commandName }) => commandName === queryCommandName);
        if (result === undefined){
            console.log("Command is undefined");
        }
        return result;
    }

    executeCommand(index: number){

    }
}