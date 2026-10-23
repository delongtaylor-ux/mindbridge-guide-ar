import test from 'node:test';
import assert from 'node:assert/strict';
import {TASKS,DAY,total,check,makeRecord,upsert,restore,progress} from './core.mjs';
test('exact sums handle thirds, quarters, mixed whole, and overflow',()=>{
  assert.equal(total([3,3,3]),12); assert.ok(check(TASKS.whole,[2,4,4]));
  assert.ok(check(TASKS.equivalent,[4,4])); assert.equal(check(TASKS.equivalent,[2]),false);
  assert.equal(check(TASKS.whole,[2,2,4]),false); assert.equal(check(TASKS.whole,[]),false);
});
test('guidance, rehearsal, and incorrect work cannot become independent evidence',()=>{
  for(const [task,parts,assisted] of [[TASKS.whole,[2,2],false],[TASKS.quarters,[4,4,4],true],[TASKS.quarters,[4],false]]){
    assert.throws(()=>makeRecord({attempt:'x',task,parts,assisted,outcome:'independent'}));
  }
});
test('correcting an observation replaces evidence for the same attempt',()=>{
  const r=makeRecord({attempt:'one',task:TASKS.quarters,parts:[4,4,4],assisted:false,outcome:'independent',now:1000});
  const records=upsert([r],{...r,outcome:'help'}); assert.equal(records.length,1);assert.equal(records[0].outcome,'help');
  assert.match(progress(records,2000),/Start with practice/);
});
test('later check requires real elapsed time and a different task',()=>{
  const first=makeRecord({attempt:'a',task:TASKS.quarters,parts:[4,4,4],assisted:false,outcome:'independent',now:1000});
  const same={...first,attempt:'b',at:1000+DAY};
  const other=makeRecord({attempt:'c',task:TASKS.thirds,parts:[3,3],assisted:false,outcome:'independent',now:1000+DAY});
  assert.doesNotMatch(progress([first,same],1000+DAY),/later independent check is recorded/);
  assert.doesNotMatch(progress([first,{...other,at:2000}],1000+DAY),/later independent check is recorded/);
  assert.match(progress([first,other],1000+DAY),/later independent check is recorded/);
});
test('restored local data rejects malformed or impossible evidence',()=>{
  assert.deepEqual(restore('bad'),[]);assert.deepEqual(restore('{"version":2,"records":[]}'),[]);
  const bad={attempt:'a',task:'quarters',parts:[4],assisted:false,outcome:'independent',mode:'challenge',at:1000};
  assert.deepEqual(restore(JSON.stringify({version:1,records:[bad]})),[]);
});
test('archived evidence can be restored without contributing to active progress',()=>{
  const r=makeRecord({attempt:'archived',task:TASKS.quarters,parts:[4,4,4],assisted:false,outcome:'independent',now:1000});
  assert.match(progress([{...r,archived:true}],2000),/Start with practice/);
  assert.match(progress([{...r,archived:false}],2000),/1 distinct challenge/);
});
