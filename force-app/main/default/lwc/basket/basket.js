/**
 * Created by odubavets on 23.12.2021.
 */

import { LightningElement, wire, track } from "lwc";
import getBasket from "@salesforce/apex/ShopController.getBasket";
import clearBasket from "@salesforce/apex/ShopController.clearBasket";
import { NavigationMixin } from "lightning/navigation";

export default class Basket extends NavigationMixin(LightningElement) {

  @track basketItems = [];
  orderOpen = false;

  @wire(getBasket)
  wiredBasketItems({ data }) {
    if (data) {
      this.basketItems = JSON.parse(JSON.stringify(data));
    } else {
      this.basketItems = [];
    }
  }

  handleClear() {
    clearBasket({ basketItems: this.basketItems })
      .then(() => {
        this.basketItems = [];
      });
  }

  handleOrder() {
    this.orderOpen = true;
  }

  handleChangedCount(event) {
    this.basketItems.find(item => item.Id === event.detail.itemId).Count__c = event.detail.amount;
  }

  get totalPrice() {
    return this.basketItems.reduce((sum, item) => sum + item.Commodity__r.Price__c * item.Count__c, 0);
  }

  get totalCount() {
    return this.basketItems.reduce((sum, item) => sum + parseInt(item.Count__c), 0);
  }

  handleOrdered() {
    this.basketItems = [];
    this.orderOpen = false;
    this.navigate();
  }

  handleDeleteItem(event) {
    this.basketItems = this.basketItems.filter(item => item.Id != event.detail);
  }

  navigate() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/lightning/n/My_orders"
      }
    });
  }

}