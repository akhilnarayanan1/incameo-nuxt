import { AlertData } from "@/assets/types";
import _ from "lodash";
import { Ref } from "vue";

export const getFieldAlerts = () => useState<AlertData[]>("fieldAlerts", () => []);

export const resetFieldAlerts = () => getFieldAlerts().value.length = 0;

export const addFieldAlert = (fieldAlert: AlertData) => {
    const foundIndex = _.findIndex(getFieldAlerts().value, {"fieldid": fieldAlert.fieldid});
    if (foundIndex < 0) {
      getFieldAlerts().value.push(fieldAlert);
    } else {
      getFieldAlerts().value[foundIndex] = fieldAlert;
    };
}

export const clearFieldAlertOnTyping = (...args: {[key:string]: Ref<string>}[]) => {
  const fieldProps = computed(() => {
    return Object.fromEntries(Object.entries(args[0]).map(([k, v]) => [k, v.value]));
  })

  watch(() => _.cloneDeep(fieldProps.value),
  (newval: {[key:string]: string}, preval: {[key:string]: string}) => {
    const changedKey = _.keys(_.pickBy(newval, (v: string, k: string) => v !== preval[k]));
    for (let i=0; i< changedKey.length; i++) {
      const isOnIndex = (_.findIndex(getFieldAlerts().value, {fieldid: changedKey[i]}));
      if(isOnIndex > -1) getFieldAlerts().value.splice(isOnIndex, 1);
    }
  })
}