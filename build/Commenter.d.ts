import { Octokit } from '@octokit/rest';
export type Comment = {
    id: number;
};
export default class Commenter {
    private readonly octokit;
    readonly commentName: string;
    readonly commentFile: string;
    constructor(octokit: Octokit, commentName: string, commentFile: string);
    static commentTagPattern(commentName: string): string;
    static get issueNumber(): number | undefined;
    static get hasIssueNumber(): boolean;
    comment(): Promise<void>;
    getAppMapComment(issueNumber: number): Promise<Comment | undefined>;
}
