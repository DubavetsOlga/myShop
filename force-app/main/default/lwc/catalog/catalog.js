/**
 * Created by odubavets on 21.12.2021.
 */

import { LightningElement, wire } from "lwc";
import getCommodities from "@salesforce/apex/ShopController.getCommodities";
import getByFilter from "@salesforce/apex/ShopController.getByFilter";
import getMaxPrice from "@salesforce/apex/ShopController.getMaxPrice";

export default class Catalog extends LightningElement {

  commodities = [];
  categoryId = null;
  loaded = false;
  valueMinPrice = 0;
  valueMaxPrice;
  valueStock = "All";
  valueRating = 0;
  valueSort = "1";

  @wire(getCommodities, { categoryId: "$categoryId" })
  wiredCommodities({ data }) {
    if (data) {
      this.commodities = data;
      this.loaded = true;
    }
  }

  @wire(getMaxPrice)
  wiredMaxPrice({ data }) {
    if (data) {
      this.max = data;
      this.valueMaxPrice = data;
    }
  }

  get optionsStock() {
    return [
      { label: "All", value: "All" },
      { label: "In stock", value: "InStock" }
    ];
  }

  get optionsSort() {
    return [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" }
    ];
  }

  handleSelectedCategory(event) {
    this.categoryId = event.detail.categoryId;
  }

  clickFilter() {
    this.loaded = false;
    getByFilter({
      minPrice: this.valueMinPrice,
      maxPrice: this.valueMaxPrice,
      inStock: this.valueStock,
      rating: this.valueRating,
      categoryId: this.categoryId
    })
      .then((data) => {
        this.commodities = data;
        this.loaded = true;
      });
  }

  changeMaxPrice(event) {
    this.valueMaxPrice = event.detail.value;
  }

  changeMinPrice(event) {
    this.valueMinPrice = event.detail.value;
  }

  changeRadio(event) {
    this.valueStock = event.detail.value;
  }

  changeRating(event) {
    this.valueRating = event.detail.value;
  }

}

