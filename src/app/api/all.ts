import { getFakeGraph } from './fake';
import data from './data';
import { Alerts, AlertType } from 'app/landmarks/PageAlertsContext';
import { groupBy, mapValues, values, uniq } from 'lodash';

//this section has a set of fake alerts notification api
//which mimics something that would come from e.g. an EventSource
let alerts: Alerts = {
  people: 100,
  violation: 200,
};

export const fetchOutstandingAlerts = async () => {
  return { ...alerts };
}

export const subscribeAlerts = (cb: (a: Alerts) => void) => {
  const interval = window.setInterval(() => {
    alerts.people += Math.round(Math.random() * 10);
    alerts.violation += Math.round(Math.random() * 10);
    cb({ ...alerts });
  }, 1500);

  return () => window.clearInterval(interval);
}

export const sendAlertsViewed = async (type: AlertType) => {
  alerts[type] = 0;
  return { ...alerts };
}

//now the actual data
export type GraphNode = {
  id: number | string,
  type: 'PERSON' | 'COMPANY',
  label: string,
  addresses: string[],
}

export type GraphRelationship = {
  src_id: number | string,
  dst_id: number | string,
  type: 'DIRECTOR_OF' | 'SECRETARY_OF' | 'LINKED_TO' | 'SHAREHOLDER_OF',
  positions: string[]
}

export type Graph = { nodes: GraphNode[], relationships: GraphRelationship[] }

const dedupe = (data: Graph): Graph => {
  return {
    ...data,
    //I saw some other duplicates, like duplicated names on nodes
    //but this is the only one that I felt is appropriate to take care of
    //on the front end from a data perspective.
    relationships: values(mapValues(
      groupBy(data.relationships, r => {
        return `${r.src_id}->${r.dst_id}(${r.type})`
      }),
      (group) => {
        return group.reduce((acc, r) => {
          return {
            ...r,
            positions: uniq(r.positions.concat(acc.positions))
          }
        }, group[0]);
      }
    ))
  }
}

export const fetchGraph = async (random: boolean): Promise<{ 
  relationships: GraphRelationship[], 
  nodes: GraphNode[]
}> => {
  if (random) {
    return getFakeGraph(100);
  } else {
    return dedupe(data as { 
      relationships: GraphRelationship[], 
      nodes: GraphNode[]
    });
  }
}
