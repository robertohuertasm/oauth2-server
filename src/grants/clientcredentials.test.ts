import * as clientcredentials from "./clientcredentials"
// @ponicode
describe("clientcredentials.start", () => {
    test("0", () => {
        let callFunction: any = () => {
            clientcredentials.start("UNLOCK TABLES;", 10.23, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            clientcredentials.start(0.0, -29.45, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            clientcredentials.start(-1.0, "zaCELgL. 0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx", undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            clientcredentials.start(10.0, 1234567890123456789012345678901234567890, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            clientcredentials.start("UNLOCK TABLES;", 0.5, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            clientcredentials.start(Infinity, Infinity, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
