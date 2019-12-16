import { useState, useEffect, useCallback } from "react"
import { 
  subscribeAlerts, 
  fetchOutstandingAlerts,
  sendAlertsViewed,
} from "app/api/all";
import { PageAlertsContextValue, Alerts, AlertType } from "app/landmarks/PageAlertsContext";

//a hook that encapsulates all the alerts logic
//it will initially makes a request to get currently outstanding alerts
//then subscribe to any updates of those numbers
//and provide the outside the method to reset the numbers
//to be fair I didn't think of this workflow just for this. My previous company used this workflow.
export const usePageAlerts = (): PageAlertsContextValue => {
  const [ alerts, setAlerts ] = useState<Alerts>({ people: 0, violation: 0 });
  const [ alertsFetched, setAlertsFetched ] = useState(false);
  useEffect(() => {
    fetchOutstandingAlerts().then((alerts) => {
      setAlerts(alerts);
      setAlertsFetched(true);
    });
  }, [])

  useEffect(() => {
    if (!alertsFetched) { return; }
    return subscribeAlerts(setAlerts);
  }, [ alertsFetched ]);

  const noitifyAlertsViewed = useCallback((type: AlertType) => {
    sendAlertsViewed(type).then((alerts) => {
      setAlerts(alerts);
    });
  }, [])

  return {
    alertsFetched,
    alerts,
    noitifyAlertsViewed,
  };
};