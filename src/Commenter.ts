import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';
import {GetResponseDataTypeFromEndpointMethod} from '@octokit/types';

import assert from 'assert';
import fs from 'fs';

export type Comment = {
  id: number;
};

export type Repo = {owner: string; repo: string};

export default class Commenter {
  public readonly issueNumber: number;
  public readonly repo: Repo;

  constructor(
    private readonly octokit: Octokit,
    public readonly commentName: string,
    issueNumber?: number,
    repo?: Repo
  ) {
    issueNumber ||= Commenter.issueNumber;
    assert(issueNumber);
    this.issueNumber = issueNumber;
    this.repo = repo || Commenter.repo;
  }

  public async commentExists(): Promise<boolean> {
    const comment = await this.getAppMapComment();
    return !!comment;
  }

  public async comment(commentFile: string) {
    const content = fs.readFileSync(commentFile, 'utf8');
    const body = `${content}\n${Commenter.commentTagPattern(this.commentName)}`;
    const comment = await this.getAppMapComment();

    if (comment) {
      await this.octokit.rest.issues.updateComment({
        ...this.repo,
        comment_id: comment.id,
        body,
      });
    } else {
      await this.octokit.rest.issues.createComment({
        ...this.repo,
        issue_number: this.issueNumber,
        body,
      });
    }
  }

  public async getAppMapComment(): Promise<Comment | undefined> {
    type ListCommentsResponseDataType = GetResponseDataTypeFromEndpointMethod<
      typeof this.octokit.rest.issues.listComments
    >;

    let comment: ListCommentsResponseDataType[0] | undefined;
    for await (const {data: comments} of this.octokit.paginate.iterator(
      this.octokit.rest.issues.listComments,
      {
        ...this.repo,
        issue_number: this.issueNumber,
      }
    )) {
      comment = comments.find(comment =>
        comment?.body?.includes(Commenter.commentTagPattern(this.commentName))
      );
      if (comment) break;
    }

    return comment;
  }

  static commentTagPattern(commentName: string): string {
    return `<!-- "${commentName}" -->`;
  }

  static get repo(): Repo {
    const {context} = github;
    return context.repo;
  }

  static get issueNumber(): number | undefined {
    const {context} = github;
    return context.payload.pull_request?.number || context.payload.issue?.number;
  }

  static get hasIssueNumber(): boolean {
    return !!Commenter.issueNumber;
  }
}
