/**
 * Created by odubavets on 04.01.2022.
 */

import { api, LightningElement, track, wire } from "lwc";
import getFavorite from "@salesforce/apex/ShopController.getFavorite";

export default class FavoriteList extends LightningElement {

  favorites = [];

  @wire(getFavorite)
  getFavorite({ data }) {
    if (data) {
      this.favorites = data;
    }
  }

}
