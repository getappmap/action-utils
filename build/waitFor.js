"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.waitFor = void 0;
function waitFor(message, test, timeout = 30000) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        let delay = 100;
        let exception;
        let result;
        const check = () => __awaiter(this, void 0, void 0, function* () {
            try {
                result = yield test();
                return result;
            }
            catch (e) {
                exception = e;
                return false;
            }
        });
        while (!(yield check())) {
            const elapsed = Date.now() - startTime;
            if (elapsed > timeout) {
                if (exception)
                    throw exception;
                else
                    throw new Error(message);
            }
            delay = delay * 2;
            console.log(`Waiting ${delay}ms because: ${message}`);
            yield wait(delay);
        }
    });
}
exports.waitFor = waitFor;
function wait(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    });
}
exports.wait = wait;
