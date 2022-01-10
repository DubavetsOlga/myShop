/**
 * Created by odubavets on 23.12.2021.
 */

import { LightningElement, wire } from "lwc";
import getAdvertising from "@salesforce/apex/ShopController.getAdvertising";

export default class Carousel extends LightningElement {

  images = [];

  @wire(getAdvertising)
  wiredImages({ data }) {
    if (data) {
      this.images = data;
    }
  }

}