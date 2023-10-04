import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';
import {GetResponseDataTypeFromEndpointMethod} from '@octokit/types';

import assert from 'assert';
import fs from 'fs';

export type Comment = {
  id: number;
};

export default class Commenter {
  constructor(
    private readonly octokit: Octokit,
    public readonly commentName: string,
    public readonly commentFile: string
  ) {}

  static commentTagPattern(commentName: string): string {
    return `<!-- "${commentName}" -->`;
  }

  static get issueNumber(): number | undefined {
    const {context} = github;
    return context.payload.pull_request?.number || context.payload.issue?.number;
  }

  static get hasIssueNumber(): boolean {
    return !!Commenter.issueNumber;
  }

  public async comment() {
    assert(Commenter.hasIssueNumber);

    const {context} = github;

    const issueNumber = Commenter.issueNumber;
    assert(issueNumber);

    const content = fs.readFileSync(this.commentFile, 'utf8');
    const body = `${content}\n${Commenter.commentTagPattern(this.commentName)}`;
    const comment = await this.getAppMapComment(issueNumber);

    if (comment) {
      await this.octokit.rest.issues.updateComment({
        ...context.repo,
        comment_id: comment.id,
        body,
      });
    } else {
      await this.octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: issueNumber,
        body,
      });
    }
  }

  public async getAppMapComment(issueNumber: number): Promise<Comment | undefined> {
    const {context} = github;

    type ListCommentsResponseDataType = GetResponseDataTypeFromEndpointMethod<
      typeof this.octokit.rest.issues.listComments
    >;

    let comment: ListCommentsResponseDataType[0] | undefined;
    for await (const {data: comments} of this.octokit.paginate.iterator(
      this.octokit.rest.issues.listComments,
      {
        ...context.repo,
        issue_number: issueNumber,
      }
    )) {
      comment = comments.find(comment =>
        comment?.body?.includes(Commenter.commentTagPattern(this.commentName))
      );
      if (comment) break;
    }

    return comment;
  }
}
