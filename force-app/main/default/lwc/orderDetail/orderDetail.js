/**
 * Created by odubavets on 27.12.2021.
 */

import { LightningElement, api } from "lwc";
import orderBasket from "@salesforce/apex/ShopController.orderBasket";

export default class OrderDetail extends LightningElement {

  @api commodities;
  firstName;
  lastName;
  address = { street: "", city: "", country: "", province: "", postalCode: "" };
  phone;
  loaded = true;
  fieldsList = ["firstName", "lastName"];
  pay = "cash";
  error = "";

  get fields() {
    return this.fieldsList;
  }

  get options() {
    return [
      { label: "Cash", value: "cash" },
      { label: "Card", value: "card" }
    ];
  }

  handleChange(event) {
    this.pay = event.detail.pay;
  }

  handleOrder() {
    if (this.phone !== "" && this.firstName !== "") {
      this.error = "";
      this.loaded = false;
      orderBasket({
        basketItems: this.commodities,
        info: {
          phone: this.phone,
          address: this.address,
          name: this.firstName + " " + this.lastName,
          pay: this.pay
        }
      })
        .then(() => {
          const orderedEvent = new CustomEvent("ordered");
          this.dispatchEvent(orderedEvent);
          this.loaded = true;
        });
    } else {
      this.error = "Fill in the required information";
    }
  }

}