import { NestExpressApplication } from "@nestjs/platform-express";

const readline = require("readline")

export const listenCommandLine = (app: NestExpressApplication) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    
    rl.on("line", (command: string | ServerCommand) => {
        handleCommand(app, command, rl)
        .then((result) => {
            if(!result) {
                console.log("\n\n** 커맨드 정보 **")
                console.log("1. close = 서버를 종료합니다.")
            }
        })
    })

    console.log("** 서버 종료는 close를 사용해 주세요. **")
    console.log("** 커맨드 입력 대기 중 입니다. **\n\n")
    console.log("** 커맨드 정보 **")
    console.log("1. close = 서버를 종료합니다.")
}

const handleCommand = async (app: NestExpressApplication, command: ServerCommand | string, rl)
: Promise<boolean> => {
    switch(command) {
        case "close":
            await app.close()
            rl.close()
            return true
        default:
            console.log("존재하지 않는 커맨드 입니다.")
            return false
    }
}

type ServerCommand =
| "close"