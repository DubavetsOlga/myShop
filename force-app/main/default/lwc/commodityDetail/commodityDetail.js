/**
 * Created by odubavets on 27.12.2021.
 */

import { LightningElement, api, wire } from "lwc";
import COMMODITY_ID_FIELD from "@salesforce/schema/Commodity__c.Id";
import COMMODITY_IMAGE_FIELD from "@salesforce/schema/Commodity__c.Image__c";
import COMMODITY_COUNT_FIELD from "@salesforce/schema/Commodity__c.Count__c";
import COMMODITY_APPROVED_FIELD from "@salesforce/schema/Commodity__c.Approved__c";
import COMMODITY_ACTIVE_FIELD from "@salesforce/schema/Commodity__c.Active__c";
import { getFieldValue, getRecord } from "lightning/uiRecordApi";

const COMMODITY_FIELDS = [
  COMMODITY_ID_FIELD,
  COMMODITY_IMAGE_FIELD,
  COMMODITY_COUNT_FIELD,
  COMMODITY_APPROVED_FIELD,
  COMMODITY_ACTIVE_FIELD];

export default class CommodityDetail extends LightningElement {

  @api recordId;

  @wire(getRecord, { recordId: "$recordId", fields: COMMODITY_FIELDS })
  wiredRecord;

  get commodityImage() {
    return getFieldValue(this.wiredRecord.data, COMMODITY_IMAGE_FIELD);
  }

  get count() {
    return getFieldValue(this.wiredRecord.data, COMMODITY_COUNT_FIELD);
  }

  get active() {
    return getFieldValue(this.wiredRecord.data, COMMODITY_ACTIVE_FIELD);
  }

  get approved() {
    return getFieldValue(this.wiredRecord.data, COMMODITY_APPROVED_FIELD);
  }

}
