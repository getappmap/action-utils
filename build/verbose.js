"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isVerbose = false;
function verbose(v) {
    if (v === 'true' || v === true) {
        isVerbose = true;
    }
    return isVerbose;
}
exports.default = verbose;
