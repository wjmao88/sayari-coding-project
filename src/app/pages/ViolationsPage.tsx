import React, { useEffect, useContext } from 'react';
import PageAlertsContext from 'app/landmarks/PageAlertsContext';

const ViolationsPage = () => {
  //well, the original mock up for this page had numbers so...
  const { alerts, noitifyAlertsViewed } = useContext(PageAlertsContext);
  useEffect(() => noitifyAlertsViewed('violation'), []);

  return (
    <div>
      <h1>
      ViolationsPage ({ alerts.violation } updates)
      </h1>
    </div>
  );
};

export default ViolationsPage;