class commandsObject {
    commandID: number;
    gestureID: number;
    commandName: string;
    commandExecution: string;
    created_at: Date;
    updated_at: Date;

    constructor(commandID: number = 0,
                commandName: string = "",
                commandExecution: string = "",
                created_at: Date = new Date(),
                updated_at: Date = new Date()
    ) {
        this.commandID = commandID;
        this.gestureID = commandID;
        this.commandName = commandName;
        this.commandExecution = commandExecution;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    displayCommandOBJ(){
        console.log(`Instance: ${this}`)
        console.log(`CommandID: ${this.commandID}`)
        console.log(`GestureID: ${this.gestureID}`)
        console.log(`CommandName: ${this.commandName}`)
        console.log(`CommandExeuction: ${this.commandExecution}`)
        console.log(`Created At: ${this.created_at}`)
        console.log(`Updated At: ${this.updated_at}`)
    }
}

export default commandsObject