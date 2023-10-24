"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
class Commenter {
    constructor(octokit, commentName, issueNumber, repo) {
        this.octokit = octokit;
        this.commentName = commentName;
        issueNumber || (issueNumber = Commenter.issueNumber);
        (0, assert_1.default)(issueNumber);
        this.issueNumber = issueNumber;
        this.repo = repo || Commenter.repo;
    }
    commentExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.getAppMapComment();
            return !!comment;
        });
    }
    comment(commentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = fs_1.default.readFileSync(commentFile, 'utf8');
            const body = `${content}\n${Commenter.commentTagPattern(this.commentName)}`;
            const comment = yield this.getAppMapComment();
            if (comment) {
                yield this.octokit.rest.issues.updateComment(Object.assign(Object.assign({}, this.repo), { comment_id: comment.id, body }));
            }
            else {
                yield this.octokit.rest.issues.createComment(Object.assign(Object.assign({}, this.repo), { issue_number: this.issueNumber, body }));
            }
        });
    }
    getAppMapComment() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let comment;
            try {
                for (var _d = true, _e = __asyncValues(this.octokit.paginate.iterator(this.octokit.rest.issues.listComments, Object.assign(Object.assign({}, this.repo), { issue_number: this.issueNumber }))), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const { data: comments } = _c;
                    comment = comments.find(comment => { var _a; return (_a = comment === null || comment === void 0 ? void 0 : comment.body) === null || _a === void 0 ? void 0 : _a.includes(Commenter.commentTagPattern(this.commentName)); });
                    if (comment)
                        break;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return comment;
        });
    }
    static commentTagPattern(commentName) {
        return `<!-- "${commentName}" -->`;
    }
    static get repo() {
        const { context } = github;
        return context.repo;
    }
    static get issueNumber() {
        var _a, _b;
        const { context } = github;
        return ((_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number) || ((_b = context.payload.issue) === null || _b === void 0 ? void 0 : _b.number);
    }
    static get hasIssueNumber() {
        return !!Commenter.issueNumber;
    }
}
exports.default = Commenter;
