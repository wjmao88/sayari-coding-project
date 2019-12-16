
import fc, { Arbitrary, Random } from 'fast-check';
import { mersenne } from 'pure-rand';
import { GraphNode, GraphRelationship } from './all';

//this has become my favorite part a lot of times
//its really made for testing, but, well, human testing is testing
//I'm actually fairly new to fast-check as I have been using jsverify.
//they both provide what I want but jsverify is no longer actively maintained :(
const personArb: Arbitrary<GraphNode> = fc.record({
  //the given data has number ids, but it doesn't really matter 
  //since its not going to be used as a number anyway
  id: fc.uuid(),
  type: fc.constant('PERSON'),
  label: fc.string(),
  addresses: fc.array(fc.string()),
});

const companyArb: Arbitrary<GraphNode> = fc.record({
  id: fc.uuid(),
  type: fc.constant('COMPANY'),
  label: fc.string(),
  addresses: fc.array(fc.string()),
});

const toRelationshipArb = (
  personIds: (string | number)[],
  companyIds: (string | number)[]
): Arbitrary<GraphRelationship> => fc.record({
  src_id: fc.oneof(...personIds.map(fc.constant)),
  dst_id: fc.oneof(...companyIds.map(fc.constant)),
  type: fc.oneof(...([
    'DIRECTOR_OF', 
    'SECRETARY_OF', 
    'LINKED_TO', 
    'SHAREHOLDER_OF'
  ].map(fc.constant))) as Arbitrary<GraphRelationship['type']>,
  positions: fc.array(fc.string())
});

const fakeGraph = (maxSize: number) => {
  return fc.record({
    persons: fc.array(personArb, maxSize/4, maxSize),
    companies: fc.array(companyArb, maxSize/4, maxSize),
  }).chain(({ persons, companies }) => {
    return fc.record({
      nodes: fc.constant(persons.concat(companies)),
      relationships: fc.array(toRelationshipArb(
        //since this just randomly takes 2, it could create
        //duplicates, but that is taken care of by the dedupe already so 
        persons.map(p => p.id),
        //normally I'd worry about selecting two different nodes
        //but since all relationships are person <-> company I can take it easy
        companies.map(p => p.id)
      ), maxSize, maxSize * 2)
    });
  });
}

export const getFakeGraph = (maxSize: number) => {
  return fakeGraph(maxSize).generate(new Random(mersenne(new Date().valueOf()))).value;
}
