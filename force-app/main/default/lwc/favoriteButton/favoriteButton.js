/**
 * Created by odubavets on 04.01.2022.
 */

import { LightningElement, api, wire } from "lwc";
import getFavoriteByCommodity from "@salesforce/apex/ShopController.getFavoriteByCommodity";
import changeFavorite from "@salesforce/apex/ShopController.changeFavorite";

export default class FavoriteButton extends LightningElement {

  @api commodityId;
  favorite;

  @wire(getFavoriteByCommodity, { commodityId: "$commodityId" })
  wiredFavorite({ data }) {
    this.favorite = data;
  }

  get variant() {
    return this.favorite ? "border-filled" : "brand";
  }

  handleFavoriteChanged() {
    changeFavorite({ commodityId: this.commodityId })
      .then(() => {
        this.favorite = !this.favorite;
      });
  }

}