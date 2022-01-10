/**
 * Created by odubavets on 03.01.2022.
 */

import { LightningElement, api } from "lwc";
import addComment from "@salesforce/apex/ShopController.addComment";

export default class AddComment extends LightningElement {
  @api commodity;
  rating = 0;
  comment = "";
  error = "";

  handleAddComment() {
    if (this.notEmpty()) {
      addComment({ commodityId: this.commodity, comment: this.comment, mark: this.rating })
        .then((data) => {
          this.error = "";
          const newCommentEvent = new CustomEvent("newcomment", { detail: data });
          this.dispatchEvent(newCommentEvent);
        });
    } else {
      this.error = "Fill in all the fields.";
    }
  }

  handleRatingChanged(event) {
    this.rating = event.detail.rating;
  }

  handleChangeComment(event) {
    this.comment = event.detail.value;
  }

  notEmpty() {
    return (this.comment !== "" && this.rating !== 0);
  }

}