/**
 * Created by odubavets on 28.12.2021.
 */

import { api, LightningElement, wire } from "lwc";
import ACCOUNT_ID_FIELD from "@salesforce/schema/Account.Id";
import ACCOUNT_LOGO_FIELD from "@salesforce/schema/Account.Logo__c";
import { getFieldValue, getRecord } from "lightning/uiRecordApi";

const ACCOUNT_FIELDS = [ACCOUNT_ID_FIELD, ACCOUNT_LOGO_FIELD];

export default class AccountDetail extends LightningElement {

  @api recordId;

  @wire(getRecord, { recordId: "$recordId", fields: ACCOUNT_FIELDS })
  wiredAccount;

  get accountLogo() {
    return getFieldValue(this.wiredAccount.data, ACCOUNT_LOGO_FIELD);
  }

}