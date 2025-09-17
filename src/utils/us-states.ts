// US States data
export const US_STATES = [
  { value: 'AL', label: 'Alabama', abbreviation: 'AL', name: 'Alabama' },
  { value: 'AK', label: 'Alaska', abbreviation: 'AK', name: 'Alaska' },
  { value: 'AZ', label: 'Arizona', abbreviation: 'AZ', name: 'Arizona' },
  { value: 'AR', label: 'Arkansas', abbreviation: 'AR', name: 'Arkansas' },
  { value: 'CA', label: 'California', abbreviation: 'CA', name: 'California' },
  { value: 'CO', label: 'Colorado', abbreviation: 'CO', name: 'Colorado' },
  { value: 'CT', label: 'Connecticut', abbreviation: 'CT', name: 'Connecticut' },
  { value: 'DE', label: 'Delaware', abbreviation: 'DE', name: 'Delaware' },
  { value: 'FL', label: 'Florida', abbreviation: 'FL', name: 'Florida' },
  { value: 'GA', label: 'Georgia', abbreviation: 'GA', name: 'Georgia' },
  { value: 'HI', label: 'Hawaii', abbreviation: 'HI', name: 'Hawaii' },
  { value: 'ID', label: 'Idaho', abbreviation: 'ID', name: 'Idaho' },
  { value: 'IL', label: 'Illinois', abbreviation: 'IL', name: 'Illinois' },
  { value: 'IN', label: 'Indiana', abbreviation: 'IN', name: 'Indiana' },
  { value: 'IA', label: 'Iowa', abbreviation: 'IA', name: 'Iowa' },
  { value: 'KS', label: 'Kansas', abbreviation: 'KS', name: 'Kansas' },
  { value: 'KY', label: 'Kentucky', abbreviation: 'KY', name: 'Kentucky' },
  { value: 'LA', label: 'Louisiana', abbreviation: 'LA', name: 'Louisiana' },
  { value: 'ME', label: 'Maine', abbreviation: 'ME', name: 'Maine' },
  { value: 'MD', label: 'Maryland', abbreviation: 'MD', name: 'Maryland' },
  { value: 'MA', label: 'Massachusetts', abbreviation: 'MA', name: 'Massachusetts' },
  { value: 'MI', label: 'Michigan', abbreviation: 'MI', name: 'Michigan' },
  { value: 'MN', label: 'Minnesota', abbreviation: 'MN', name: 'Minnesota' },
  { value: 'MS', label: 'Mississippi', abbreviation: 'MS', name: 'Mississippi' },
  { value: 'MO', label: 'Missouri', abbreviation: 'MO', name: 'Missouri' },
  { value: 'MT', label: 'Montana', abbreviation: 'MT', name: 'Montana' },
  { value: 'NE', label: 'Nebraska', abbreviation: 'NE', name: 'Nebraska' },
  { value: 'NV', label: 'Nevada', abbreviation: 'NV', name: 'Nevada' },
  { value: 'NH', label: 'New Hampshire', abbreviation: 'NH', name: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey', abbreviation: 'NJ', name: 'New Jersey' },
  { value: 'NM', label: 'New Mexico', abbreviation: 'NM', name: 'New Mexico' },
  { value: 'NY', label: 'New York', abbreviation: 'NY', name: 'New York' },
  { value: 'NC', label: 'North Carolina', abbreviation: 'NC', name: 'North Carolina' },
  { value: 'ND', label: 'North Dakota', abbreviation: 'ND', name: 'North Dakota' },
  { value: 'OH', label: 'Ohio', abbreviation: 'OH', name: 'Ohio' },
  { value: 'OK', label: 'Oklahoma', abbreviation: 'OK', name: 'Oklahoma' },
  { value: 'OR', label: 'Oregon', abbreviation: 'OR', name: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania', abbreviation: 'PA', name: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island', abbreviation: 'RI', name: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina', abbreviation: 'SC', name: 'South Carolina' },
  { value: 'SD', label: 'South Dakota', abbreviation: 'SD', name: 'South Dakota' },
  { value: 'TN', label: 'Tennessee', abbreviation: 'TN', name: 'Tennessee' },
  { value: 'TX', label: 'Texas', abbreviation: 'TX', name: 'Texas' },
  { value: 'UT', label: 'Utah', abbreviation: 'UT', name: 'Utah' },
  { value: 'VT', label: 'Vermont', abbreviation: 'VT', name: 'Vermont' },
  { value: 'VA', label: 'Virginia', abbreviation: 'VA', name: 'Virginia' },
  { value: 'WA', label: 'Washington', abbreviation: 'WA', name: 'Washington' },
  { value: 'WV', label: 'West Virginia', abbreviation: 'WV', name: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin', abbreviation: 'WI', name: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming', abbreviation: 'WY', name: 'Wyoming' }
];

export const getStateByValue = (value: string) => {
  return US_STATES.find(state => state.value === value);
};

export const getStateByLabel = (label: string) => {
  return US_STATES.find(state => state.label.toLowerCase() === label.toLowerCase());
};

export const getSortedUSStates = () => {
  return [...US_STATES].sort((a, b) => a.label.localeCompare(b.label));
};