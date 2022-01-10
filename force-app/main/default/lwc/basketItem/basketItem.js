/**
 * Created by odubavets on 23.12.2021.
 */

import { LightningElement, api } from "lwc";
import deleteFromBasket from "@salesforce/apex/ShopController.deleteFromBasket";

export default class BasketItem extends LightningElement {

  @api item;
  amount = 1;

  connectedCallback() {
    this.amount = this.item.Count__c;
  }

  handleAmountChange(event) {
    this.amount = event.detail.value;
    this.newAmountValue();
  }

  get price() {
    return this.item.Commodity__r.Price__c * this.amount;
  }

  get href() {
    return "/lightning/r/Commodity__c/" + this.item.Commodity__c + "/view";
  }

  newAmountValue() {
    const changedAmountEvent = new CustomEvent("changed", { detail: { amount: this.amount, itemId: this.item.Id } });
    this.dispatchEvent(changedAmountEvent);
  }

  get issue() {
    return (this.item.Commodity__r.Count__c == 0
      && this.item.Commodity__r.Active__c == true
      && this.item.Commodity__r.Approved__c == true) ? "Not available" : ("Available: " + this.item.Commodity__r.Count__c);
  }

  handleDelete() {
    const deleteEvent = new CustomEvent("delete", { detail: this.item.Id });
    deleteFromBasket({ basketItem: this.item })
      .then(() => {
        this.dispatchEvent(deleteEvent);
      });
  }

  changeCount(event) {
    this.amount = event.detail;
    this.newAmountValue();
  }

}
