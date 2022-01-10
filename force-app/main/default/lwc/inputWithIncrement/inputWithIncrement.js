/**
 * Created by odubavets on 03.01.2022.
 */

import { LightningElement, api } from "lwc";

export default class InputWithIncrement extends LightningElement {

  @api amount;
  @api max;
  @api min;

  increment() {
    this.amount < this.max && this.amount++;
    this.newValue();
  }

  decrement() {
    this.amount > 1 && this.amount--;
    this.newValue();
  }

  newValue() {
    const changedEvent = new CustomEvent("changed", { detail: this.amount });
    this.dispatchEvent(changedEvent);
  }
}