import { createContext } from "react";

export type AlertType = 'people' | 'violation';

export type Alerts = Record<AlertType, number>;

export type PageAlertsContextValue = {
  alertsFetched: boolean,
  alerts: Alerts,
  noitifyAlertsViewed: (t: AlertType) => void,
};

const PageAlertsContext = createContext<PageAlertsContextValue>({
  alertsFetched: false,
  alerts: { people: 0, violation: 0 },
  noitifyAlertsViewed: () => void 0,
});

export default PageAlertsContext;