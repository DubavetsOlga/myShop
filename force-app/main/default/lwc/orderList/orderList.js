/**
 * Created by odubavets on 03.01.2022.
 */

import { LightningElement, wire } from "lwc";
import getOrders from "@salesforce/apex/ShopController.getOrders";

export default class OrderList extends LightningElement {

  orders;

  @wire(getOrders)
  wiredOrders({ data }) {
    if (data) {
      this.orders = data;
    }
  }

}