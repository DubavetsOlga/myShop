/**
 * Created by odubavets on 03.01.2022.
 */

import { LightningElement, wire, api } from "lwc";
import checkInBasket from "@salesforce/apex/ShopController.checkInBasket";
import addToBasket from "@salesforce/apex/ShopController.addToBasket";

export default class AddInBasketLabel extends LightningElement {

  @api record;
  @api count;
  @api active;
  @api approved;
  disabled;
  label;
  inCart;

  @wire(checkInBasket, { commodityId: "$record" })
  basketFunc({ data }) {
    if (data === true || data === false) {
      this.inCart = data;
      this.label = this.inCart ? "In Basket" : "Add to Basket";
      this.disabled = (!(this.count > 0 && this.active && this.approved && !this.inCart));
    }
  }

  handleAddToBasket() {
    addToBasket({ commodityId: this.record })
      .then(() => {
        this.inCart = true;
        this.label = "In Shopping Cart";
        this.disabled = true;
      });
  }
}