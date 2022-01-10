/**
 * Created by odubavets on 27.12.2021.
 */

import { LightningElement, wire, api, track } from "lwc";
import getComments from "@salesforce/apex/ShopController.getComments";
import checkCommentByAccountAndCommodity from "@salesforce/apex/ShopController.checkCommentByAccountAndCommodity";

export default class CommentList extends LightningElement {

  @track comments = [];
  @api recordId;
  showAddComment = true;

  @wire(getComments, { commodityId: "$recordId" })
  wiredComment({ data }) {
    if (data) {
      this.comments = JSON.parse(JSON.stringify(data));
    }
  }

  @wire(checkCommentByAccountAndCommodity, { commodityId: "$recordId" })
  commentIssue({ data }) {
    if (data === true || data === false) {
      this.showAddComment = data;
    }
  }

  handleNewComment(event) {
    this.comments.push(JSON.parse(JSON.stringify(event.detail)));
    this.showAddComment = false;
  }

}