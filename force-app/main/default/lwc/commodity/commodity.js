/**
 * Created by odubavets on 22.12.2021.
 */

import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class Commodity extends NavigationMixin(LightningElement) {

  @api commodity;

  get backgroundStyle() {
    return "background-image:url(" + this.commodity.Image__c + ")";
  }

  get href() {
    return "/lightning/r/Account/" + this.commodity.Account__c + "/view";
  }

  selectCommodity() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.commodity.Id,
        objectApiName: "Commodity__c",
        actionName: "view"
      }
    });
  }

}