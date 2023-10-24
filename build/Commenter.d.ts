import { Octokit } from '@octokit/rest';
export type Comment = {
    id: number;
};
export type Repo = {
    owner: string;
    repo: string;
};
export default class Commenter {
    private readonly octokit;
    readonly commentName: string;
    readonly issueNumber: number;
    readonly repo: Repo;
    constructor(octokit: Octokit, commentName: string, issueNumber?: number, repo?: Repo);
    commentExists(): Promise<boolean>;
    comment(commentFile: string): Promise<void>;
    getAppMapComment(): Promise<Comment | undefined>;
    static commentTagPattern(commentName: string): string;
    static get repo(): Repo;
    static get issueNumber(): number | undefined;
    static get hasIssueNumber(): boolean;
}
