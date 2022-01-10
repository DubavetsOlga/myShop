/**
 * Created by odubavets on 21.12.2021.
 */

import { LightningElement, track, wire } from "lwc";
import getCommodities from "@salesforce/apex/ShopController.getCommodities";
import getByFilter from "@salesforce/apex/ShopController.getByFilter";
import getMaxPrice from "@salesforce/apex/ShopController.getMaxPrice";

export default class Catalog extends LightningElement {

  @track commodities = [];
  categoryId = null;
  loaded = false;
  valueMinPrice = 0;
  valueMaxPrice;
  valueStock = "All";
  valueRating = 0;
  valueSort = "title";

  @wire(getCommodities, { categoryId: "$categoryId" })
  wiredCommodities({ data }) {
    if (data) {
      this.commodities = JSON.parse(JSON.stringify(data));
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
      { label: "Title", value: "title" },
      { label: "Rating", value: "rating" },
      { label: "Price", value: "price" }
    ];
  }

  сomparators = {
    title: (a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0,
    rating: (a, b) => b.Rating__c - a.Rating__c,
    price: (a, b) => a.Price__c - b.Price__c,
  };

  currentComparator = this.сomparators.title;

  get vcommodities() {
    return this.commodities.sort(this.currentComparator);
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

  sortCommodities(event) {
    this.currentComparator = this.сomparators[event.detail.value];
  }

}
