/**
 * Simple test utility to verify state list functionality
 */

import { getSortedUSStates } from './us-states';

export function testStateList() {
  const states = getSortedUSStates();
  
  console.log(`✅ Total states loaded: ${states.length}`);
  console.log('First 5 states (alphabetically):');
  states.slice(0, 5).forEach(state => {
    console.log(`- ${state.name} (${state.abbreviation})`);
  });
  
  console.log('Last 5 states (alphabetically):');
  states.slice(-5).forEach(state => {
    console.log(`- ${state.name} (${state.abbreviation})`);
  });
  
  return states.length;
}
