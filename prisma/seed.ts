import { PrismaClient } from "@prisma/client";
import { UserSecurity } from "../src/common/auth";
import * as fs from "fs"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient()
const jsonFile = fs.readFileSync('./prisma/seed.json', 'utf-8')
const staticData = JSON.parse(jsonFile)

async function main() {
    console.log("시드 데이터를 등록합니다...")
    /** 
     * 필요한 함수만 호출해서 사용 해주세요.
     * 편의성 제공을 위해 커맨드를 사용하려 했으나 prisma seed 에서는
     * 커맨드 라인 입력이 되질 않아 직접 주석을 지우셔서 해야 하는 점 양해 부탁드립니다.
     * */

    /** 어드민을 등록 합니다. */
    // const result1 = await addAdmin()
    // if(!result1) return result1

    /** 학교 페이지를 등록 합니다. */
    // const result2 = await addSchool()
    // if(!result2) return result2
    
    /** 사용자를 등록 합니다. */
    // const result3 = await addUser()
    // if(!result3) return result3

    /** 현재 등록 된 학교 페이지를 모두 지웁니다. */
    // const result4 = await resetSchool()
    // if(!result4) return result4

    return true
}

async function addAdmin() {
    console.log("어드민 계정을 추가합니다.")
    const email = "admin@admin.com" // 다른 이메일을 원하실 경우 이곳을 수정해 주세요.
    const password = "admin" // 다른 비밀번호를 원하실 경우 이곳을 수정해 주세요.
    const { salt, hash } = UserSecurity.encryption(password)

    try {
        const result = await prisma
        .user
        .create({
            data: {
                email,
                pass: hash,
                salt,
                authority: 1004,
            }
        })
        .then(entity => !!entity)

        if(result) console.log(`어드민이 성공적으로 등록 되었습니다.\n이메일: ${email}\n비밀번호: ${password}`)
        else {
            console.log("어드민 등록에 실패 했습니다.\n입력 값을 확인 해 주세요.")
            return false
        }

        return true
    } catch(e) {
        console.log("어드민 등록에 실패 했습니다.")
        if(e instanceof PrismaClientKnownRequestError) {
            console.log(`제약 조건을 확인 해 주세요.\n${e.code}\n${e.message}`)
        } else console.log(e)
        return false
    }
}

async function addSchool() {
    console.log("학교 페이지를 추가합니다.")
    const queries: object[] = []
    
    for(let name of Object.keys(staticData)) {
        const query = staticData[name]
        queries.push({
            name,
            region: query['region'],
        })
    }
    
    try {
        await prisma
        .$transaction(async tx => {
            for(let i=0; i<queries.length; ++i) {
                const query = queries[i]
                await tx.school.create({
                    data: {
                        name: query['name'],
                        region: query['region'],
                    }
                })
            }
        })
        
        console.log(`성공적으로 학교 페이지를 등록 하였습니다.\n생성 된 수: ${queries.length}`)

        return true
    } catch(e) {
        console.log("학교 페이지 등록에 실패 했습니다.")
        if(e instanceof PrismaClientKnownRequestError) {
            console.log(`제약 조건을 확인 해 주세요.\n${e.code}\n${e.message}`)
        } else console.log(e)
        return false
    }
}

async function resetSchool() {
    console.log("학교 페이지를 초기화 합니다.")

    try {
        const result = await prisma
        .school
        .deleteMany()

        if(result) console.log(`성공적으로 학교 페이지를 초기화 하였습니다.\n삭제 된 수: ${result.count}`)
        else {
            console.log("학교 페이지 초기화에 실패 했습니다.\n시드 데이터를 확인 해 주세요.")
            return false
        }

        return true
    } catch(e) {
        console.log("학교 페이지 초기화에 실패 했습니다.")
        if(e instanceof PrismaClientKnownRequestError) {
            console.log(`제약 조건을 확인 해 주세요.\n${e.code}\n${e.message}`)
        } else console.log(e)
        return false
    }
}

async function addUser() {
    console.log("일반 유저 계정을 추가합니다.")
    const email = "tester@test.com" // 다른 이메일을 원하실 경우 이곳을 수정해 주세요.
    const password = "tester" // 다른 비밀번호를 원하실 경우 이곳을 수정해 주세요.
    const { salt, hash } = UserSecurity.encryption(password)

    try {
        const result = await prisma
        .user
        .create({
            data: {
                email,
                pass: hash,
                salt,
            }
        })
        .then(entity => !!entity)

        if(result) console.log(`유저 계정이 성공적으로 등록 되었습니다.\n이메일: ${email}\n비밀번호: ${password}`)
        else {
            console.log("유저 등록에 실패 했습니다.\n입력 값을 확인 해 주세요.")
            return false
        }

        return true
    } catch(e) {
        console.log("유저 등록에 실패 했습니다.")
        if(e instanceof PrismaClientKnownRequestError) {
            console.log(`제약 조건을 확인 해 주세요.\n${e.code}\n${e.message}`)
        } else console.log(e)
        return false
    }
}

(async function () {
    await main()
    .then(result=> {
        console.log("\n")
        if(result) console.log("성공적으로 시드 데이터를 등록 했습니다.")
        else console.log("시드 데이터 등록에 실패 했습니다.")
        prisma.$disconnect()
    })
    .catch(err => {
        console.log(err)
        prisma.$disconnect()
    })
})()