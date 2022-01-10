/**
 * Created by odubavets on 04.01.2022.
 */

import { LightningElement, wire, api } from "lwc";
import getCommodities from "@salesforce/apex/ShopController.getCommodities";

export default class CommodityByCategory extends LightningElement {

  @api recordId;

  commodities = [];

  @wire(getCommodities, { categoryId: "$recordId" })
  wiredCommodities({ data }) {
    if (data) {
      this.commodities = data;
    }
  }

}