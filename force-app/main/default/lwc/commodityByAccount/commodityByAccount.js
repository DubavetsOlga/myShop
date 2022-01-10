/**
 * Created by odubavets on 28.12.2021.
 */

import { LightningElement, api, wire } from "lwc";
import getCommoditiesByAccount from "@salesforce/apex/ShopController.getCommoditiesByAccount";

export default class CommodityByAccount extends LightningElement {

  @api recordId;

  commodities = [];

  @wire(getCommoditiesByAccount, { accountId: "$recordId" })
  wiredCommodities({ data, error }) {
    if (data) {
      this.commodities = data;
    } else if (error) {
      this.commodities = [];
    }
  }

}