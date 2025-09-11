/**
 * Complete list of US states with their abbreviations
 * For use in address forms and state selection dropdowns
 */

export interface USState {
  name: string;
  abbreviation: string;
}

export const US_STATES: USState[] = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
  { name: 'District of Columbia', abbreviation: 'DC' },
  { name: 'American Samoa', abbreviation: 'AS' },
  { name: 'Guam', abbreviation: 'GU' },
  { name: 'Northern Mariana Islands', abbreviation: 'MP' },
  { name: 'Puerto Rico', abbreviation: 'PR' },
  { name: 'United States Minor Outlying Islands', abbreviation: 'UM' },
  { name: 'U.S. Virgin Islands', abbreviation: 'VI' }
];

/**
 * Get a sorted array of US states for use in dropdown menus
 * @returns Array of USState objects sorted alphabetically by name
 */
export function getSortedUSStates(): USState[] {
  return [...US_STATES].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get state name from abbreviation
 * @param abbreviation Two-letter state abbreviation (e.g., 'CA')
 * @returns Full state name or null if not found
 */
export function getStateNameFromAbbreviation(abbreviation: string): string | null {
  const state = US_STATES.find(state => state.abbreviation === abbreviation.toUpperCase());
  return state ? state.name : null;
}

/**
 * Get state abbreviation from name
 * @param name Full state name (e.g., 'California')
 * @returns Two-letter state abbreviation or null if not found
 */
export function getStateAbbreviationFromName(name: string): string | null {
  const state = US_STATES.find(state => 
    state.name.toLowerCase() === name.toLowerCase()
  );
  return state ? state.abbreviation : null;
}
