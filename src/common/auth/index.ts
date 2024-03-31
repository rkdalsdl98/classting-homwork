import { pbkdf2Sync } from "crypto"
import { nanoid } from "nanoid"

export namespace UserSecurity {
    export const getRandNanoId = (size?: number) => nanoid(size ?? 32) 
    /**
     * json 형식의 data를 사용 할 경우 JSON.stringify를 이용해 string으로 타입변환해서 사용 합니다.
     * @param data
     * @param options 
     * @returns 
     */
    export const encryption = (
        data: string,
        salt?: string
    ) : { salt: string, hash: string} => {
        salt = salt ?? getRandNanoId()
        const buffer : Buffer = Buffer.from(data, "utf-8")
        const hash = pbkdf2Sync(
            buffer, 
            salt, 
            10000, 
            32, 
            "sha256",
        ).toString("base64")

        return { salt, hash }
    }
    
    /**
     * json 형식의 data를 사용 할 경우 JSON.stringify를 이용해 string으로 타입변환해서 사용 합니다.
     * @param {string} data
     * @param {string} salt 
     * @param {string} comparedHash
     * @returns 
     */
    export const verify = (
        data: string, 
        salt: string, 
        comparedHash: string
    ) : boolean => {
        const { hash } = encryption(data, salt)
        return hash === comparedHash
    }
}