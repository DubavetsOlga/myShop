/**
 * Created by odubavets on 22.12.2021.
 */

import { LightningElement, wire, track } from "lwc";
import getCategory from "@salesforce/apex/ShopController.getCategory";

export default class CategoriesTree extends LightningElement {

  @track items = [];
  categories;
  selectedItemValue;

  @wire(getCategory)
  recipeFunc({data}) {
    if (data) {
      this.categories = data;
      this.buildItem();
    }
  }

  handleOnselectCategory(event) {
    this.selectedItemValue = event.detail.name;
    const selectedEvent = new CustomEvent("selected", {
      detail: {
        categoryId: this.selectedItemValue
      }
    });
    this.dispatchEvent(selectedEvent);
  }

  buildItem() {
    let temp = [];
    let innerItems = [];
    let firstCategory = this.categories[0].Category__c;
    this.categories.forEach((element) => {
      if (firstCategory !== element.Category__c) {
        temp.push(
          {
            label: firstCategory,
            name: null,
            expanded: false,
            items: innerItems
          }
        );
        innerItems = [];
        firstCategory = element.Category__c;
      }
      innerItems.push(
        {
          label: element.Name + " (" + element.CountCommodity__c + ")",
          name: element.Id,
          expanded: false,
          items: []
        }
      );
    });
    temp.push(
      {
        label: firstCategory,
        name: null,
        expanded: false,
        items: innerItems
      }
    );
    this.items = temp;
  }
}