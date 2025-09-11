'use client';

import React, { useState, useRef } from 'react';

interface ApartmentDensityMarker {
  id: string;
  position: {
    x: number; // X coordinate on the US map (0-100%)
    y: number; // Y coordinate on the US map (0-100%)
  };
  apartmentCount: number;
  city: string;
  state: string;
  averagePrice: number;
}

interface USMapWithDensityCompleteProps {
  apartments: any[];
  onMarkerClick?: (marker: ApartmentDensityMarker) => void;
}

// Generate comprehensive apartment density data for ALL 50 US states
const generateCompleteUSApartmentData = (): ApartmentDensityMarker[] => {
  const densityData: ApartmentDensityMarker[] = [];
  let markerId = 1;

  // COMPREHENSIVE ALL 50 STATES + DC - Major cities with apartment density
  const allStateCities = [
    // WEST COAST
    // 1. WASHINGTON
    { city: 'Seattle', state: 'WA', x: 15, y: 15, count: 55000, price: 3400 },
    { city: 'Spokane', state: 'WA', x: 20, y: 18, count: 12000, price: 1800 },
    { city: 'Tacoma', state: 'WA', x: 14, y: 17, count: 18000, price: 2200 },
    
    // 2. OREGON
    { city: 'Portland', state: 'OR', x: 12, y: 25, count: 35000, price: 2800 },
    { city: 'Eugene', state: 'OR', x: 11, y: 28, count: 8000, price: 1900 },
    { city: 'Salem', state: 'OR', x: 11, y: 26, count: 6000, price: 1700 },
    
    // 3. CALIFORNIA
    { city: 'Los Angeles', state: 'CA', x: 15, y: 60, count: 85000, price: 3800 },
    { city: 'San Francisco', state: 'CA', x: 8, y: 45, count: 75000, price: 4800 },
    { city: 'San Diego', state: 'CA', x: 16, y: 68, count: 42000, price: 3200 },
    { city: 'San Jose', state: 'CA', x: 10, y: 48, count: 55000, price: 4200 },
    { city: 'Oakland', state: 'CA', x: 9, y: 47, count: 45000, price: 3600 },
    { city: 'Sacramento', state: 'CA', x: 12, y: 42, count: 25000, price: 2800 },
    { city: 'Fresno', state: 'CA', x: 14, y: 50, count: 18000, price: 2200 },
    { city: 'Long Beach', state: 'CA', x: 16, y: 61, count: 22000, price: 3400 },
    
    // MOUNTAIN WEST
    // 4. NEVADA
    { city: 'Las Vegas', state: 'NV', x: 22, y: 55, count: 38000, price: 2200 },
    { city: 'Reno', state: 'NV', x: 18, y: 42, count: 15000, price: 2000 },
    { city: 'Henderson', state: 'NV', x: 23, y: 56, count: 12000, price: 2100 },
    
    // 5. IDAHO
    { city: 'Boise', state: 'ID', x: 28, y: 30, count: 15000, price: 1800 },
    { city: 'Nampa', state: 'ID', x: 27, y: 31, count: 4000, price: 1600 },
    { city: 'Meridian', state: 'ID', x: 28, y: 31, count: 5000, price: 1700 },
    
    // 6. UTAH
    { city: 'Salt Lake City', state: 'UT', x: 32, y: 42, count: 22000, price: 2000 },
    { city: 'West Valley City', state: 'UT', x: 31, y: 43, count: 6000, price: 1800 },
    { city: 'Provo', state: 'UT', x: 32, y: 45, count: 8000, price: 1700 },
    
    // 7. ARIZONA
    { city: 'Phoenix', state: 'AZ', x: 25, y: 62, count: 45000, price: 2000 },
    { city: 'Tucson', state: 'AZ', x: 28, y: 68, count: 22000, price: 1700 },
    { city: 'Mesa', state: 'AZ', x: 26, y: 63, count: 18000, price: 1900 },
    { city: 'Chandler', state: 'AZ', x: 26, y: 64, count: 12000, price: 2100 },
    
    // 8. COLORADO
    { city: 'Denver', state: 'CO', x: 40, y: 45, count: 42000, price: 2600 },
    { city: 'Colorado Springs', state: 'CO', x: 38, y: 48, count: 18000, price: 2000 },
    { city: 'Aurora', state: 'CO', x: 41, y: 46, count: 15000, price: 2400 },
    
    // 9. NEW MEXICO
    { city: 'Albuquerque', state: 'NM', x: 38, y: 58, count: 18000, price: 1600 },
    { city: 'Las Cruces', state: 'NM', x: 36, y: 65, count: 4000, price: 1400 },
    { city: 'Rio Rancho', state: 'NM', x: 37, y: 57, count: 3000, price: 1500 },
    
    // 10. WYOMING
    { city: 'Cheyenne', state: 'WY', x: 42, y: 38, count: 3500, price: 1400 },
    { city: 'Casper', state: 'WY', x: 40, y: 35, count: 2500, price: 1300 },
    
    // 11. MONTANA
    { city: 'Billings', state: 'MT', x: 45, y: 25, count: 4000, price: 1300 },
    { city: 'Missoula', state: 'MT', x: 40, y: 22, count: 3000, price: 1200 },
    { city: 'Great Falls', state: 'MT', x: 42, y: 20, count: 2000, price: 1100 },
    
    // GREAT PLAINS
    // 12. NORTH DAKOTA
    { city: 'Fargo', state: 'ND', x: 52, y: 20, count: 5000, price: 1200 },
    { city: 'Bismarck', state: 'ND', x: 48, y: 22, count: 2500, price: 1100 },
    { city: 'Grand Forks', state: 'ND', x: 54, y: 18, count: 2000, price: 1000 },
    
    // 13. SOUTH DAKOTA
    { city: 'Sioux Falls', state: 'SD', x: 52, y: 30, count: 6000, price: 1100 },
    { city: 'Rapid City', state: 'SD', x: 46, y: 32, count: 3000, price: 1000 },
    { city: 'Aberdeen', state: 'SD', x: 50, y: 28, count: 1500, price: 900 },
    
    // 14. NEBRASKA
    { city: 'Omaha', state: 'NE', x: 50, y: 38, count: 18000, price: 1500 },
    { city: 'Lincoln', state: 'NE', x: 49, y: 40, count: 8000, price: 1300 },
    { city: 'Bellevue', state: 'NE', x: 51, y: 38, count: 3000, price: 1400 },
    
    // 15. KANSAS
    { city: 'Wichita', state: 'KS', x: 48, y: 48, count: 12000, price: 1200 },
    { city: 'Overland Park', state: 'KS', x: 52, y: 45, count: 8000, price: 1600 },
    { city: 'Kansas City', state: 'KS', x: 52, y: 44, count: 6000, price: 1500 },
    { city: 'Topeka', state: 'KS', x: 50, y: 46, count: 4000, price: 1100 },
    
    // 16. OKLAHOMA
    { city: 'Oklahoma City', state: 'OK', x: 48, y: 58, count: 25000, price: 1400 },
    { city: 'Tulsa', state: 'OK', x: 50, y: 55, count: 18000, price: 1300 },
    { city: 'Norman', state: 'OK', x: 48, y: 59, count: 5000, price: 1200 },
    
    // SOUTH
    // 17. TEXAS
    { city: 'Houston', state: 'TX', x: 45, y: 70, count: 75000, price: 2100 },
    { city: 'Dallas', state: 'TX', x: 48, y: 62, count: 65000, price: 2200 },
    { city: 'Austin', state: 'TX', x: 46, y: 68, count: 38000, price: 2500 },
    { city: 'San Antonio', state: 'TX', x: 44, y: 72, count: 42000, price: 1800 },
    { city: 'Fort Worth', state: 'TX', x: 47, y: 63, count: 28000, price: 1900 },
    { city: 'El Paso', state: 'TX', x: 38, y: 72, count: 15000, price: 1500 },
    
    // 18. LOUISIANA
    { city: 'New Orleans', state: 'LA', x: 58, y: 72, count: 22000, price: 1800 },
    { city: 'Baton Rouge', state: 'LA', x: 56, y: 70, count: 12000, price: 1500 },
    { city: 'Shreveport', state: 'LA', x: 54, y: 68, count: 8000, price: 1300 },
    
    // 19. ARKANSAS
    { city: 'Little Rock', state: 'AR', x: 54, y: 60, count: 8000, price: 1200 },
    { city: 'Fort Smith', state: 'AR', x: 52, y: 58, count: 4000, price: 1000 },
    { city: 'Fayetteville', state: 'AR', x: 52, y: 56, count: 3000, price: 1100 },
    
    // 20. MISSISSIPPI
    { city: 'Jackson', state: 'MS', x: 58, y: 65, count: 6000, price: 1100 },
    { city: 'Gulfport', state: 'MS', x: 60, y: 70, count: 3000, price: 1000 },
    { city: 'Southaven', state: 'MS', x: 58, y: 60, count: 2500, price: 1200 },
    
    // 21. ALABAMA
    { city: 'Birmingham', state: 'AL', x: 64, y: 62, count: 12000, price: 1300 },
    { city: 'Mobile', state: 'AL', x: 62, y: 68, count: 8000, price: 1200 },
    { city: 'Montgomery', state: 'AL', x: 64, y: 65, count: 6000, price: 1100 },
    { city: 'Huntsville', state: 'AL', x: 64, y: 58, count: 8000, price: 1400 },
    
    // 22. TENNESSEE
    { city: 'Nashville', state: 'TN', x: 64, y: 55, count: 32000, price: 2200 },
    { city: 'Memphis', state: 'TN', x: 58, y: 58, count: 25000, price: 1400 },
    { city: 'Knoxville', state: 'TN', x: 68, y: 54, count: 10000, price: 1300 },
    { city: 'Chattanooga', state: 'TN', x: 66, y: 58, count: 8000, price: 1200 },
    
    // 23. KENTUCKY
    { city: 'Louisville', state: 'KY', x: 62, y: 50, count: 22000, price: 1500 },
    { city: 'Lexington', state: 'KY', x: 66, y: 48, count: 12000, price: 1400 },
    { city: 'Bowling Green', state: 'KY', x: 64, y: 52, count: 4000, price: 1200 },
    
    // 24. MISSOURI
    { city: 'Kansas City', state: 'MO', x: 52, y: 45, count: 25000, price: 1700 },
    { city: 'St. Louis', state: 'MO', x: 58, y: 48, count: 28000, price: 1600 },
    { city: 'Springfield', state: 'MO', x: 54, y: 52, count: 6000, price: 1200 },
    { city: 'Independence', state: 'MO', x: 53, y: 46, count: 5000, price: 1500 },
    
    // MIDWEST
    // 25. IOWA
    { city: 'Des Moines', state: 'IA', x: 54, y: 38, count: 10000, price: 1300 },
    { city: 'Cedar Rapids', state: 'IA', x: 56, y: 36, count: 5000, price: 1200 },
    { city: 'Davenport', state: 'IA', x: 58, y: 38, count: 4000, price: 1100 },
    
    // 26. MINNESOTA
    { city: 'Minneapolis', state: 'MN', x: 55, y: 25, count: 32000, price: 2200 },
    { city: 'St. Paul', state: 'MN', x: 56, y: 26, count: 18000, price: 2000 },
    { city: 'Rochester', state: 'MN', x: 55, y: 30, count: 6000, price: 1800 },
    { city: 'Duluth', state: 'MN', x: 58, y: 20, count: 4000, price: 1500 },
    
    // 27. WISCONSIN
    { city: 'Milwaukee', state: 'WI', x: 60, y: 30, count: 25000, price: 1800 },
    { city: 'Madison', state: 'WI', x: 58, y: 32, count: 12000, price: 1700 },
    { city: 'Green Bay', state: 'WI', x: 60, y: 28, count: 5000, price: 1500 },
    
    // 28. ILLINOIS
    { city: 'Chicago', state: 'IL', x: 62, y: 35, count: 95000, price: 2800 },
    { city: 'Aurora', state: 'IL', x: 61, y: 36, count: 8000, price: 2200 },
    { city: 'Rockford', state: 'IL', x: 60, y: 33, count: 6000, price: 1400 },
    { city: 'Joliet', state: 'IL', x: 62, y: 37, count: 7000, price: 2000 },
    
    // 29. MICHIGAN
    { city: 'Detroit', state: 'MI', x: 68, y: 30, count: 25000, price: 1400 },
    { city: 'Grand Rapids', state: 'MI', x: 66, y: 28, count: 12000, price: 1500 },
    { city: 'Warren', state: 'MI', x: 69, y: 30, count: 8000, price: 1300 },
    { city: 'Sterling Heights', state: 'MI', x: 69, y: 29, count: 6000, price: 1400 },
    
    // 30. INDIANA
    { city: 'Indianapolis', state: 'IN', x: 64, y: 42, count: 28000, price: 1600 },
    { city: 'Fort Wayne', state: 'IN', x: 66, y: 38, count: 8000, price: 1300 },
    { city: 'Evansville', state: 'IN', x: 62, y: 48, count: 5000, price: 1200 },
    
    // 31. OHIO
    { city: 'Columbus', state: 'OH', x: 70, y: 40, count: 28000, price: 1700 },
    { city: 'Cleveland', state: 'OH', x: 70, y: 35, count: 22000, price: 1500 },
    { city: 'Cincinnati', state: 'OH', x: 68, y: 45, count: 18000, price: 1600 },
    { city: 'Toledo', state: 'OH', x: 68, y: 36, count: 6000, price: 1300 },
    { city: 'Akron', state: 'OH', x: 70, y: 37, count: 8000, price: 1400 },
    
    // SOUTHEAST
    // 32. WEST VIRGINIA
    { city: 'Charleston', state: 'WV', x: 72, y: 48, count: 5000, price: 1200 },
    { city: 'Huntington', state: 'WV', x: 70, y: 50, count: 3000, price: 1100 },
    { city: 'Morgantown', state: 'WV', x: 74, y: 46, count: 4000, price: 1300 },
    
    // 33. VIRGINIA
    { city: 'Virginia Beach', state: 'VA', x: 78, y: 52, count: 20000, price: 2000 },
    { city: 'Norfolk', state: 'VA', x: 78, y: 53, count: 12000, price: 1800 },
    { city: 'Richmond', state: 'VA', x: 76, y: 50, count: 15000, price: 1900 },
    { city: 'Newport News', state: 'VA', x: 78, y: 52, count: 8000, price: 1700 },
    
    // 34. NORTH CAROLINA
    { city: 'Charlotte', state: 'NC', x: 72, y: 58, count: 35000, price: 2100 },
    { city: 'Raleigh', state: 'NC', x: 75, y: 58, count: 28000, price: 2000 },
    { city: 'Greensboro', state: 'NC', x: 74, y: 56, count: 12000, price: 1700 },
    { city: 'Durham', state: 'NC', x: 75, y: 57, count: 10000, price: 1900 },
    { city: 'Winston-Salem', state: 'NC', x: 73, y: 56, count: 8000, price: 1600 },
    
    // 35. SOUTH CAROLINA
    { city: 'Charleston', state: 'SC', x: 74, y: 65, count: 15000, price: 1900 },
    { city: 'Columbia', state: 'SC', x: 72, y: 62, count: 10000, price: 1600 },
    { city: 'North Charleston', state: 'SC', x: 74, y: 64, count: 5000, price: 1800 },
    
    // 36. GEORGIA
    { city: 'Atlanta', state: 'GA', x: 68, y: 62, count: 55000, price: 2400 },
    { city: 'Augusta', state: 'GA', x: 70, y: 64, count: 8000, price: 1500 },
    { city: 'Savannah', state: 'GA', x: 72, y: 67, count: 10000, price: 1700 },
    { city: 'Columbus', state: 'GA', x: 67, y: 65, count: 6000, price: 1400 },
    
    // 37. FLORIDA
    { city: 'Miami', state: 'FL', x: 75, y: 85, count: 48000, price: 3200 },
    { city: 'Tampa', state: 'FL', x: 70, y: 78, count: 32000, price: 2400 },
    { city: 'Orlando', state: 'FL', x: 72, y: 75, count: 35000, price: 2200 },
    { city: 'Jacksonville', state: 'FL', x: 72, y: 68, count: 28000, price: 1900 },
    { city: 'Fort Lauderdale', state: 'FL', x: 76, y: 83, count: 22000, price: 2800 },
    { city: 'St. Petersburg', state: 'FL', x: 69, y: 78, count: 12000, price: 2300 },
    { city: 'Hialeah', state: 'FL', x: 75, y: 84, count: 8000, price: 2900 },
    
    // NORTHEAST
    // 38. MARYLAND
    { city: 'Baltimore', state: 'MD', x: 78, y: 43, count: 32000, price: 2200 },
    { city: 'Frederick', state: 'MD', x: 76, y: 44, count: 4000, price: 2000 },
    { city: 'Rockville', state: 'MD', x: 77, y: 44, count: 3000, price: 2500 },
    
    // 39. DELAWARE
    { city: 'Wilmington', state: 'DE', x: 79, y: 42, count: 5000, price: 1800 },
    { city: 'Dover', state: 'DE', x: 79, y: 44, count: 2000, price: 1600 },
    { city: 'Newark', state: 'DE', x: 79, y: 43, count: 3000, price: 1700 },
    
    // 40. PENNSYLVANIA
    { city: 'Philadelphia', state: 'PA', x: 80, y: 40, count: 48000, price: 2400 },
    { city: 'Pittsburgh', state: 'PA', x: 72, y: 42, count: 18000, price: 1600 },
    { city: 'Allentown', state: 'PA', x: 79, y: 38, count: 6000, price: 1800 },
    { city: 'Erie', state: 'PA', x: 72, y: 33, count: 4000, price: 1300 },
    
    // 41. NEW JERSEY
    { city: 'Newark', state: 'NJ', x: 81, y: 38, count: 25000, price: 2800 },
    { city: 'Jersey City', state: 'NJ', x: 81, y: 37, count: 22000, price: 3100 },
    { city: 'Paterson', state: 'NJ', x: 81, y: 36, count: 8000, price: 2500 },
    { city: 'Elizabeth', state: 'NJ', x: 81, y: 38, count: 6000, price: 2600 },
    
    // 42. NEW YORK
    { city: 'New York City', state: 'NY', x: 82, y: 32, count: 125000, price: 4500 },
    { city: 'Brooklyn', state: 'NY', x: 83, y: 33, count: 95000, price: 3200 },
    { city: 'Queens', state: 'NY', x: 84, y: 32, count: 85000, price: 2800 },
    { city: 'Buffalo', state: 'NY', x: 76, y: 28, count: 15000, price: 1400 },
    { city: 'Rochester', state: 'NY', x: 78, y: 30, count: 12000, price: 1500 },
    { city: 'Yonkers', state: 'NY', x: 82, y: 31, count: 10000, price: 3500 },
    { city: 'Syracuse', state: 'NY', x: 78, y: 32, count: 8000, price: 1600 },
    { city: 'Albany', state: 'NY', x: 80, y: 30, count: 6000, price: 1800 },
    
    // 43. CONNECTICUT
    { city: 'Hartford', state: 'CT', x: 85, y: 35, count: 8000, price: 2200 },
    { city: 'New Haven', state: 'CT', x: 84, y: 36, count: 10000, price: 2400 },
    { city: 'Stamford', state: 'CT', x: 83, y: 35, count: 6000, price: 3000 },
    { city: 'Waterbury', state: 'CT', x: 84, y: 35, count: 4000, price: 2000 },
    
    // 44. RHODE ISLAND
    { city: 'Providence', state: 'RI', x: 87, y: 34, count: 8000, price: 2300 },
    { city: 'Warwick', state: 'RI', x: 87, y: 35, count: 3000, price: 2100 },
    { city: 'Cranston', state: 'RI', x: 87, y: 34, count: 2500, price: 2200 },
    
    // 45. MASSACHUSETTS
    { city: 'Boston', state: 'MA', x: 87, y: 28, count: 55000, price: 3500 },
    { city: 'Worcester', state: 'MA', x: 85, y: 30, count: 10000, price: 2200 },
    { city: 'Springfield', state: 'MA', x: 84, y: 32, count: 8000, price: 1900 },
    { city: 'Cambridge', state: 'MA', x: 87, y: 28, count: 6000, price: 3800 },
    
    // 46. VERMONT
    { city: 'Burlington', state: 'VT', x: 84, y: 25, count: 4000, price: 1900 },
    { city: 'South Burlington', state: 'VT', x: 84, y: 26, count: 1500, price: 1800 },
    { city: 'Rutland', state: 'VT', x: 83, y: 28, count: 1000, price: 1600 },
    
    // 47. NEW HAMPSHIRE
    { city: 'Manchester', state: 'NH', x: 86, y: 27, count: 6000, price: 2000 },
    { city: 'Nashua', state: 'NH', x: 86, y: 28, count: 4000, price: 2100 },
    { city: 'Concord', state: 'NH', x: 85, y: 26, count: 2000, price: 1800 },
    
    // 48. MAINE
    { city: 'Portland', state: 'ME', x: 88, y: 22, count: 8000, price: 1800 },
    { city: 'Lewiston', state: 'ME', x: 88, y: 24, count: 3000, price: 1500 },
    { city: 'Bangor', state: 'ME', x: 90, y: 20, count: 2500, price: 1400 },
    
    // 49. ALASKA (Inset positioning - bottom left)
    { city: 'Anchorage', state: 'AK', x: 8, y: 85, count: 12000, price: 2500 },
    { city: 'Fairbanks', state: 'AK', x: 10, y: 82, count: 3000, price: 2200 },
    { city: 'Juneau', state: 'AK', x: 12, y: 84, count: 2000, price: 2400 },
    
    // 50. HAWAII (Inset positioning - bottom left)
    { city: 'Honolulu', state: 'HI', x: 25, y: 85, count: 18000, price: 3800 },
    { city: 'Pearl City', state: 'HI', x: 24, y: 86, count: 3000, price: 3500 },
    { city: 'Hilo', state: 'HI', x: 26, y: 87, count: 2500, price: 3200 },
    
    // WASHINGTON DC (Federal District)
    { city: 'Washington', state: 'DC', x: 78, y: 45, count: 65000, price: 3200 }
  ];

  // Add major cities
  allStateCities.forEach(city => {
    densityData.push({
      id: `major-${markerId++}`,
      position: { x: city.x, y: city.y },
      apartmentCount: city.count,
      city: city.city,
      state: city.state,
      averagePrice: city.price
    });
  });

  // Generate suburban markers around major cities
  allStateCities.forEach(city => {
    if (city.count > 10000) { // Only for larger cities
      const surroundingCount = Math.floor(city.count * 0.25);
      
      for (let i = 0; i < 4; i++) { // 4 suburban markers per major city
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 4;
        
        const x = Math.max(2, Math.min(98, city.x + offsetX));
        const y = Math.max(2, Math.min(98, city.y + offsetY));
        
        densityData.push({
          id: `suburb-${markerId++}`,
          position: { x, y },
          apartmentCount: Math.floor(surroundingCount * (0.3 + Math.random() * 0.7)),
          city: `${city.city} Area`,
          state: city.state,
          averagePrice: Math.floor(city.price * (0.8 + Math.random() * 0.3))
        });
      }
    }
  });

  // Generate additional smaller city markers for comprehensive coverage
  for (let i = 0; i < 400; i++) {
    const x = 5 + Math.random() * 90;
    const y = 10 + Math.random() * 80;
    
    const apartmentCount = Math.floor(500 + Math.random() * 8000);
    const averagePrice = Math.floor(800 + Math.random() * 1800);
    
    // Determine region based on position
    let region = 'Central';
    if (x < 25) region = 'West';
    else if (x < 50) region = 'Mountain';
    else if (x > 75) region = 'East';
    else if (y > 60) region = 'South';
    
    densityData.push({
      id: `small-${markerId++}`,
      position: { x, y },
      apartmentCount,
      city: `${region} City ${markerId}`,
      state: region,
      averagePrice
    });
  }

  return densityData;
};

const USMapWithDensityComplete: React.FC<USMapWithDensityCompleteProps> = ({
  apartments,
  onMarkerClick
}) => {
  const [densityData] = useState<ApartmentDensityMarker[]>(() => generateCompleteUSApartmentData());
  const [hoveredMarker, setHoveredMarker] = useState<ApartmentDensityMarker | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getMarkerSize = (apartmentCount: number) => {
    // Much larger markers like in Apartments.com - minimum 20px, maximum 80px
    return Math.min(Math.max(apartmentCount / 1500, 20), 80);
  };

  const getMarkerOpacity = (apartmentCount: number) => {
    // Higher opacity for better visibility
    return Math.min(Math.max(apartmentCount / 30000, 0.85), 1.0);
  };

  const formatApartmentCount = (count: number) => {
    if (count > 10000) return Math.floor(count / 1000) + 'K';
    if (count > 1000) return Math.floor(count / 100) / 10 + 'K';
    return count.toString();
  };

  return (
    <div className="relative w-full h-full bg-gray-100" onMouseMove={handleMouseMove}>
      <div ref={mapRef} className="w-full h-full relative">
        {/* Google Maps Style Background */}
        <div className="absolute inset-0 bg-gray-100">
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full"
            style={{ filter: 'none' }}
          >
            {/* Street Map Style Background */}
            <defs>
              {/* Realistic Terrain Gradients - Matching Reference Image */}
              
              {/* Realistic Satellite Imagery Colors */}
              
              {/* Mountain Terrain - Natural Brown/Gray Earth Tones */}
              <linearGradient id="mountainTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b5b47" />
                <stop offset="30%" stopColor="#5d4e3a" />
                <stop offset="60%" stopColor="#4a3f2f" />
                <stop offset="100%" stopColor="#3d3426" />
              </linearGradient>
              
              {/* High Mountain Peaks - Realistic Snow/Rock */}
              <linearGradient id="snowCappedPeaks" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8e4df" />
                <stop offset="40%" stopColor="#d4cfc7" />
                <stop offset="70%" stopColor="#b8b3aa" />
                <stop offset="100%" stopColor="#9c958c" />
              </linearGradient>
              
              {/* Desert Terrain - Natural Sand/Rock Colors */}
              <linearGradient id="desertTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b8936a" />
                <stop offset="40%" stopColor="#a67c52" />
                <stop offset="70%" stopColor="#8a6b47" />
                <stop offset="100%" stopColor="#6b5339" />
              </linearGradient>
              
              {/* Great Plains - Natural Grassland Colors */}
              <linearGradient id="plainsTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7a8a4f" />
                <stop offset="30%" stopColor="#6b7a42" />
                <stop offset="70%" stopColor="#5c6b38" />
                <stop offset="100%" stopColor="#4d5c2e" />
              </linearGradient>
              
              {/* Forest Terrain - Natural Forest Green */}
              <linearGradient id="forestTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3d4f2f" />
                <stop offset="30%" stopColor="#334126" />
                <stop offset="70%" stopColor="#29331d" />
                <stop offset="100%" stopColor="#1f2515" />
              </linearGradient>
              
              {/* Water Bodies - Natural Water Blue */}
              <linearGradient id="realisticWater" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a90a4" />
                <stop offset="50%" stopColor="#3d7a8c" />
                <stop offset="100%" stopColor="#2f5f6b" />
              </linearGradient>
              
              {/* Coastal Areas - Natural Coastal Colors */}
              <linearGradient id="coastalTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5a7a47" />
                <stop offset="50%" stopColor="#4a6538" />
                <stop offset="100%" stopColor="#3a502a" />
              </linearGradient>
              
              {/* Florida Swamplands - Natural Wetland Colors */}
              <linearGradient id="swampTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3d5635" />
                <stop offset="50%" stopColor="#2f4328" />
                <stop offset="100%" stopColor="#21301b" />
              </linearGradient>
              
              {/* Satellite Imagery Texture Patterns */}
              
              {/* Terrain Texture - Adds realistic satellite look */}
              <pattern id="terrainTexture" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect width="8" height="8" fill="#8a7a6b" opacity="0.1"/>
                <circle cx="2" cy="2" r="0.5" fill="#6b5b47" opacity="0.3"/>
                <circle cx="6" cy="4" r="0.3" fill="#5d4e3a" opacity="0.2"/>
                <circle cx="4" cy="7" r="0.4" fill="#4a3f2f" opacity="0.25"/>
              </pattern>
              
              {/* Forest Texture - Realistic forest canopy pattern */}
              <pattern id="forestTexture" patternUnits="userSpaceOnUse" width="6" height="6">
                <rect width="6" height="6" fill="#334126" opacity="0.1"/>
                <circle cx="1" cy="1" r="0.8" fill="#29331d" opacity="0.4"/>
                <circle cx="4" cy="3" r="0.6" fill="#1f2515" opacity="0.3"/>
                <circle cx="2" cy="5" r="0.7" fill="#29331d" opacity="0.35"/>
              </pattern>
              
              {/* Desert Texture - Sand and rock pattern */}
              <pattern id="desertTexture" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect width="10" height="10" fill="#a67c52" opacity="0.1"/>
                <ellipse cx="3" cy="2" rx="1" ry="0.5" fill="#8a6b47" opacity="0.2"/>
                <ellipse cx="7" cy="6" rx="1.2" ry="0.8" fill="#6b5339" opacity="0.15"/>
                <circle cx="8" cy="3" r="0.4" fill="#8a6b47" opacity="0.25"/>
              </pattern>
              
              {/* Plains Texture - Agricultural/grassland pattern */}
              <pattern id="plainsTexture" patternUnits="userSpaceOnUse" width="12" height="12">
                <rect width="12" height="12" fill="#6b7a42" opacity="0.1"/>
                <rect x="1" y="1" width="10" height="2" fill="#5c6b38" opacity="0.2"/>
                <rect x="1" y="5" width="10" height="2" fill="#4d5c2e" opacity="0.15"/>
                <rect x="1" y="9" width="10" height="2" fill="#5c6b38" opacity="0.18"/>
              </pattern>
              
              {/* Water Texture - Natural water surface */}
              <pattern id="waterTexture" patternUnits="userSpaceOnUse" width="15" height="15">
                <rect width="15" height="15" fill="#3d7a8c" opacity="0.1"/>
                <path d="M0,7 Q7,5 15,7 Q7,9 0,7" fill="#2f5f6b" opacity="0.2"/>
                <path d="M0,11 Q7,9 15,11 Q7,13 0,11" fill="#4a90a4" opacity="0.15"/>
              </pattern>
              
              {/* Urban Areas Pattern - More subtle */}
              <pattern id="urbanPattern" patternUnits="userSpaceOnUse" width="3" height="3">
                <rect width="3" height="3" fill="#6b5b47" opacity="0.3"/>
                <rect x="0.5" y="0.5" width="2" height="2" fill="none" stroke="#5d4e3a" strokeWidth="0.1" opacity="0.5"/>
              </pattern>
            </defs>
            
            {/* Realistic Terrain Background - Matching Reference Image */}
            
            {/* Base Ocean Background */}
            <rect width="1000" height="600" fill="url(#realisticWater)" />
            
            {/* Continental United States - Realistic Terrain Regions */}
            
            {/* Pacific Northwest - Dense Forest with Texture */}
            <path d="M 50 100 Q 150 80, 200 120 Q 250 140, 280 180 Q 300 220, 280 260 Q 250 280, 200 290 Q 150 300, 100 280 Q 50 260, 40 220 Q 30 180, 50 140 Z" 
                  fill="url(#forestTerrain)" />
            <path d="M 50 100 Q 150 80, 200 120 Q 250 140, 280 180 Q 300 220, 280 260 Q 250 280, 200 290 Q 150 300, 100 280 Q 50 260, 40 220 Q 30 180, 50 140 Z" 
                  fill="url(#forestTexture)" opacity="0.6" />
            
            {/* Rocky Mountains - High Elevation with Terrain Texture */}
            <path d="M 280 120 Q 350 100, 420 140 Q 480 180, 520 220 Q 560 260, 580 300 Q 600 340, 580 380 Q 560 420, 520 450 Q 480 480, 420 460 Q 350 440, 320 400 Q 290 360, 280 320 Q 270 280, 280 240 Q 290 200, 300 160 Z" 
                  fill="url(#mountainTerrain)" />
            <path d="M 280 120 Q 350 100, 420 140 Q 480 180, 520 220 Q 560 260, 580 300 Q 600 340, 580 380 Q 560 420, 520 450 Q 480 480, 420 460 Q 350 440, 320 400 Q 290 360, 280 320 Q 270 280, 280 240 Q 290 200, 300 160 Z" 
                  fill="url(#terrainTexture)" opacity="0.7" />
            
            {/* Snow-capped Peaks - Highest Mountains */}
            <ellipse cx="400" cy="200" rx="80" ry="40" fill="url(#snowCappedPeaks)" opacity="0.9" />
            <ellipse cx="450" cy="180" rx="60" ry="30" fill="url(#snowCappedPeaks)" opacity="0.95" />
            <ellipse cx="380" cy="220" rx="50" ry="25" fill="url(#snowCappedPeaks)" opacity="0.8" />
            
            {/* Great Plains - Central Agricultural Region with Plains Texture */}
            <path d="M 420 200 Q 520 180, 620 200 Q 720 220, 780 240 Q 820 260, 840 300 Q 860 340, 840 380 Q 820 420, 780 440 Q 720 460, 620 450 Q 520 440, 460 420 Q 420 400, 400 360 Q 380 320, 390 280 Q 400 240, 420 200 Z" 
                  fill="url(#plainsTerrain)" />
            <path d="M 420 200 Q 520 180, 620 200 Q 720 220, 780 240 Q 820 260, 840 300 Q 860 340, 840 380 Q 820 420, 780 440 Q 720 460, 620 450 Q 520 440, 460 420 Q 420 400, 400 360 Q 380 320, 390 280 Q 400 240, 420 200 Z" 
                  fill="url(#plainsTexture)" opacity="0.8" />
            
            {/* Southwest Desert - Arizona, New Mexico with Desert Texture */}
            <path d="M 200 350 Q 300 330, 400 360 Q 500 390, 550 430 Q 600 470, 580 510 Q 560 550, 520 580 Q 480 610, 440 600 Q 400 590, 360 570 Q 320 550, 290 520 Q 260 490, 240 450 Q 220 410, 200 370 Z" 
                  fill="url(#desertTerrain)" />
            <path d="M 200 350 Q 300 330, 400 360 Q 500 390, 550 430 Q 600 470, 580 510 Q 560 550, 520 580 Q 480 610, 440 600 Q 400 590, 360 570 Q 320 550, 290 520 Q 260 490, 240 450 Q 220 410, 200 370 Z" 
                  fill="url(#desertTexture)" opacity="0.7" />
            
            {/* Appalachian Mountains - Eastern Range with Terrain Texture */}
            <path d="M 780 180 Q 820 160, 860 180 Q 900 200, 920 240 Q 940 280, 930 320 Q 920 360, 900 400 Q 880 440, 860 460 Q 840 480, 820 470 Q 800 460, 790 440 Q 780 420, 770 400 Q 760 380, 765 360 Q 770 340, 775 320 Q 780 300, 785 280 Q 790 260, 795 240 Q 800 220, 790 200 Z" 
                  fill="url(#mountainTerrain)" />
            <path d="M 780 180 Q 820 160, 860 180 Q 900 200, 920 240 Q 940 280, 930 320 Q 920 360, 900 400 Q 880 440, 860 460 Q 840 480, 820 470 Q 800 460, 790 440 Q 780 420, 770 400 Q 760 380, 765 360 Q 770 340, 775 320 Q 780 300, 785 280 Q 790 260, 795 240 Q 800 220, 790 200 Z" 
                  fill="url(#terrainTexture)" opacity="0.6" />
            
            {/* Eastern Forests - Dense Woodland with Forest Texture */}
            <path d="M 820 240 Q 860 220, 900 250 Q 940 280, 960 320 Q 980 360, 970 400 Q 960 440, 940 470 Q 920 500, 900 510 Q 880 520, 860 510 Q 840 500, 830 480 Q 820 460, 815 440 Q 810 420, 815 400 Q 820 380, 825 360 Q 830 340, 835 320 Q 840 300, 835 280 Q 830 260, 825 240 Z" 
                  fill="url(#forestTerrain)" />
            <path d="M 820 240 Q 860 220, 900 250 Q 940 280, 960 320 Q 980 360, 970 400 Q 960 440, 940 470 Q 920 500, 900 510 Q 880 520, 860 510 Q 840 500, 830 480 Q 820 460, 815 440 Q 810 420, 815 400 Q 820 380, 825 360 Q 830 340, 835 320 Q 840 300, 835 280 Q 830 260, 825 240 Z" 
                  fill="url(#forestTexture)" opacity="0.8" />
            
            {/* Florida Peninsula - Swamplands with Swamp Texture */}
            <path d="M 880 480 Q 900 460, 920 480 Q 940 500, 950 530 Q 960 560, 950 590 Q 940 610, 920 620 Q 900 630, 885 625 Q 870 620, 860 610 Q 850 600, 855 585 Q 860 570, 865 555 Q 870 540, 875 525 Q 880 510, 885 495 Z" 
                  fill="url(#swampTerrain)" />
            <path d="M 880 480 Q 900 460, 920 480 Q 940 500, 950 530 Q 960 560, 950 590 Q 940 610, 920 620 Q 900 630, 885 625 Q 870 620, 860 610 Q 850 600, 855 585 Q 860 570, 865 555 Q 870 540, 875 525 Q 880 510, 885 495 Z" 
                  fill="url(#forestTexture)" opacity="0.5" />
            
            {/* California Central Valley with Plains Texture */}
            <ellipse cx="120" cy="380" rx="40" ry="120" fill="url(#plainsTerrain)" />
            <ellipse cx="120" cy="380" rx="40" ry="120" fill="url(#plainsTexture)" opacity="0.6" />
            
            {/* Texas Plains with Plains Texture */}
            <ellipse cx="480" cy="520" rx="100" ry="80" fill="url(#plainsTerrain)" />
            <ellipse cx="480" cy="520" rx="100" ry="80" fill="url(#plainsTexture)" opacity="0.7" />
            
            {/* Coastal Regions */}
            <path d="M 50 200 Q 100 180, 150 200 Q 200 220, 250 240 Q 300 260, 350 280 Q 400 300, 450 320 Q 500 340, 550 360 Q 600 380, 650 400 Q 700 420, 750 440 Q 800 460, 850 480 Q 900 500, 950 520" 
                  stroke="url(#coastalTerrain)" strokeWidth="20" fill="none" opacity="0.6" />
            
            {/* Atlantic Coastline */}
            <path d="M 920 200 Q 940 250, 960 300 Q 980 350, 970 400 Q 960 450, 950 500 Q 940 550, 930 580" 
                  stroke="url(#coastalTerrain)" strokeWidth="15" fill="none" opacity="0.7" />
            
            {/* Gulf Coast */}
            <path d="M 400 580 Q 500 590, 600 585 Q 700 580, 800 575 Q 850 570, 900 575" 
                  stroke="url(#coastalTerrain)" strokeWidth="18" fill="none" opacity="0.6" />
            
            {/* Major Water Bodies - Great Lakes, Rivers */}
            
            {/* Great Lakes - Realistic positioning and shape with Water Texture */}
            <ellipse cx="700" cy="220" rx="45" ry="25" fill="url(#realisticWater)" /> {/* Lake Superior */}
            <ellipse cx="700" cy="220" rx="45" ry="25" fill="url(#waterTexture)" opacity="0.4" />
            
            <ellipse cx="680" cy="250" rx="35" ry="20" fill="url(#realisticWater)" /> {/* Lake Michigan */}
            <ellipse cx="680" cy="250" rx="35" ry="20" fill="url(#waterTexture)" opacity="0.4" />
            
            <ellipse cx="720" cy="260" rx="30" ry="18" fill="url(#realisticWater)" /> {/* Lake Huron */}
            <ellipse cx="720" cy="260" rx="30" ry="18" fill="url(#waterTexture)" opacity="0.4" />
            
            <ellipse cx="750" cy="280" rx="25" ry="15" fill="url(#realisticWater)" /> {/* Lake Erie */}
            <ellipse cx="750" cy="280" rx="25" ry="15" fill="url(#waterTexture)" opacity="0.4" />
            
            <ellipse cx="780" cy="270" rx="20" ry="12" fill="url(#realisticWater)" /> {/* Lake Ontario */}
            <ellipse cx="780" cy="270" rx="20" ry="12" fill="url(#waterTexture)" opacity="0.4" />
            
            {/* Major Rivers */}
            {/* Mississippi River - North to South */}
            <path d="M 600 200 Q 580 250, 560 300 Q 540 350, 520 400 Q 500 450, 480 500 Q 460 550, 450 580" 
                  stroke="url(#realisticWater)" strokeWidth="8" fill="none" opacity="0.9" />
            
            {/* Missouri River */}
            <path d="M 450 280 Q 500 270, 550 280 Q 580 290, 600 300" 
                  stroke="url(#realisticWater)" strokeWidth="6" fill="none" opacity="0.8" />
            
            {/* Colorado River */}
            <path d="M 350 400 Q 320 450, 290 500 Q 260 550, 230 580" 
                  stroke="url(#realisticWater)" strokeWidth="5" fill="none" opacity="0.8" />
            
            {/* Rio Grande */}
            <path d="M 380 480 Q 400 520, 420 560 Q 440 600, 460 620" 
                  stroke="url(#realisticWater)" strokeWidth="4" fill="none" opacity="0.8" />
            
            {/* Columbia River */}
            <path d="M 150 180 Q 200 170, 250 180 Q 280 190, 300 200" 
                  stroke="url(#realisticWater)" strokeWidth="5" fill="none" opacity="0.8" />
            
            {/* Subtle State Boundaries - Google Maps style */}
            <g opacity="0.3">
              {/* Major state lines */}
              <line x1="280" y1="140" x2="280" y2="520" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="420" y1="140" x2="420" y2="520" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="560" y1="140" x2="560" y2="520" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="700" y1="140" x2="700" y2="520" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="840" y1="140" x2="840" y2="520" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              
              <line x1="150" y1="220" x2="920" y2="220" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="150" y1="320" x2="920" y2="320" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="150" y1="420" x2="920" y2="420" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
            </g>
            
            {/* Major Urban Areas - Subtle indication */}
            <circle cx="850" cy="280" r="15" fill="url(#urbanPattern)" opacity="0.6" /> {/* NYC */}
            <circle cx="140" cy="450" r="12" fill="url(#urbanPattern)" opacity="0.6" /> {/* LA */}
            <circle cx="680" cy="300" r="10" fill="url(#urbanPattern)" opacity="0.6" /> {/* Chicago */}
            <circle cx="480" cy="550" r="10" fill="url(#urbanPattern)" opacity="0.6" /> {/* Houston */}
            <circle cx="480" cy="520" r="8" fill="url(#urbanPattern)" opacity="0.6" /> {/* Dallas */}
            <circle cx="100" cy="400" r="10" fill="url(#urbanPattern)" opacity="0.6" /> {/* SF */}
            <circle cx="450" cy="380" r="8" fill="url(#urbanPattern)" opacity="0.6" /> {/* Denver */}
            <circle cx="320" cy="480" r="8" fill="url(#urbanPattern)" opacity="0.6" /> {/* Phoenix */}
            
            {/* Major City Labels - Google Maps Style */}
            <g className="city-labels" style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
              {/* West Coast */}
              <text x="60" y="160" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Seattle</text>
              <text x="50" y="220" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Portland</text>
              <text x="80" y="400" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>San Francisco</text>
              <text x="140" y="480" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Los Angeles</text>
              <text x="160" y="540" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>San Diego</text>
              
              {/* Southwest */}
              <text x="240" y="460" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Las Vegas</text>
              <text x="320" y="500" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Phoenix</text>
              <text x="380" y="480" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Albuquerque</text>
              
              {/* Mountain West */}
              <text x="340" y="380" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Salt Lake City</text>
              <text x="450" y="380" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Denver</text>
              
              {/* Central */}
              <text x="680" y="320" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Chicago</text>
              <text x="620" y="380" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Kansas City</text>
              <text x="560" y="420" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Omaha</text>
              <text x="560" y="280" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Minneapolis</text>
              
              {/* South */}
              <text x="480" y="540" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Houston</text>
              <text x="520" y="520" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Dallas</text>
              <text x="580" y="560" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>San Antonio</text>
              <text x="720" y="520" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>New Orleans</text>
              <text x="780" y="480" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Atlanta</text>
              <text x="840" y="540" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Tampa</text>
              <text x="880" y="520" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Miami</text>
              
              {/* East Coast */}
              <text x="850" y="300" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>New York</text>
              <text x="820" y="380" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Washington</text>
              <text x="880" y="420" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Charlotte</text>
              <text x="880" y="580" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Jacksonville</text>
              <text x="920" y="560" fill="white" textAnchor="middle" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Orlando</text>
              
              {/* State Labels - Larger */}
              <text x="150" y="300" fill="#64748b" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>CALIFORNIA</text>
              <text x="480" y="320" fill="#64748b" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>COLORADO</text>
              <text x="500" y="440" fill="#64748b" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>TEXAS</text>
              <text x="850" y="350" fill="#64748b" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>NEW YORK</text>
              <text x="880" y="480" fill="#64748b" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>FLORIDA</text>
            </g>
            
            {/* Alaska Inset (bottom left) */}
            <g transform="translate(50, 450) scale(0.8)">
              <path
                d="M 0 0 C 20 -10, 60 -20, 100 -15 C 140 -10, 180 0, 200 20 C 210 40, 200 60, 180 80 C 160 100, 120 110, 80 100 C 40 90, 10 60, 0 30 Z"
                fill="url(#mainlandGradient)"
                stroke="#065f46"
                strokeWidth="1.5"
              />
              <text x="100" y="120" textAnchor="middle" className="text-xs font-semibold fill-gray-700">ALASKA</text>
            </g>
            
            {/* Hawaii Inset (bottom left) */}
            <g transform="translate(200, 480) scale(0.6)">
              <circle cx="0" cy="0" r="8" fill="url(#mainlandGradient)" stroke="#065f46" strokeWidth="1" />
              <circle cx="20" cy="5" r="6" fill="url(#mainlandGradient)" stroke="#065f46" strokeWidth="1" />
              <circle cx="40" cy="0" r="5" fill="url(#mainlandGradient)" stroke="#065f46" strokeWidth="1" />
              <circle cx="60" cy="-3" r="4" fill="url(#mainlandGradient)" stroke="#065f46" strokeWidth="1" />
              <text x="30" y="35" textAnchor="middle" className="text-xs font-semibold fill-gray-700">HAWAII</text>
            </g>
            
            {/* Enhanced Geographic Features */}
            {/* Rocky Mountains */}
            <path
              d="M 280 180 C 320 175, 360 185, 380 220 C 390 260, 370 300, 340 330 C 310 350, 280 345, 260 320 C 250 295, 265 250, 280 180 Z"
              fill="url(#mountainGradient)"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Appalachian Mountains */}
            <path
              d="M 720 200 C 760 195, 790 210, 805 240 C 815 270, 800 300, 770 320 C 740 335, 710 330, 690 305 C 680 280, 695 240, 720 200 Z"
              fill="url(#mountainGradient)"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.7"
            />
            
            {/* Great Plains */}
            <path
              d="M 400 200 C 480 195, 560 205, 620 220 C 660 235, 680 260, 670 290 C 660 320, 630 335, 590 330 C 550 325, 510 315, 470 300 C 430 285, 400 250, 400 200 Z"
              fill="url(#plainsGradient)"
              stroke="#d97706"
              strokeWidth="1"
              opacity="0.6"
            />
            
            {/* Desert Southwest */}
            <path
              d="M 200 350 C 260 345, 320 360, 360 390 C 380 420, 370 450, 340 470 C 310 485, 270 480, 240 460 C 210 440, 200 400, 200 350 Z"
              fill="url(#desertGradient)"
              stroke="#c2410c"
              strokeWidth="1"
              opacity="0.7"
            />
            
            {/* Enhanced Water Features */}
            {/* Mississippi River System */}
            <path
              d="M 550 200 Q 540 250, 535 300 Q 530 350, 525 400 Q 520 450, 515 500"
              stroke="#1d4ed8"
              strokeWidth="4"
              fill="none"
              opacity="0.8"
            />
            
            {/* Missouri River */}
            <path
              d="M 450 250 Q 480 260, 520 270 Q 540 275, 550 280"
              stroke="#1d4ed8"
              strokeWidth="3"
              fill="none"
              opacity="0.7"
            />
            
            {/* Colorado River */}
            <path
              d="M 280 350 Q 300 380, 320 410 Q 340 440, 360 470"
              stroke="#1d4ed8"
              strokeWidth="3"
              fill="none"
              opacity="0.7"
            />
            
            {/* Enhanced Great Lakes */}
            <ellipse cx="650" cy="220" rx="28" ry="18" fill="#1d4ed8" opacity="0.8" />
            <ellipse cx="685" cy="235" rx="22" ry="14" fill="#1d4ed8" opacity="0.8" />
            <ellipse cx="715" cy="245" rx="20" ry="12" fill="#1d4ed8" opacity="0.8" />
            <ellipse cx="620" cy="240" rx="18" ry="10" fill="#1d4ed8" opacity="0.8" />
            <ellipse cx="590" cy="255" rx="15" ry="8" fill="#1d4ed8" opacity="0.8" />
            
            {/* State Boundaries - Enhanced */}
            {Array.from({ length: 12 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={150 + i * 65}
                y1="140"
                x2={150 + i * 65}
                y2="520"
                stroke="#9ca3af"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="4,4"
              />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="150"
                y1={180 + i * 60}
                x2="930"
                y2={180 + i * 60}
                stroke="#9ca3af"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="4,4"
              />
            ))}
          </svg>
        </div>

        {/* All 50 States Apartment Density Markers */}
        {densityData.map((marker) => {
          const size = getMarkerSize(marker.apartmentCount);
          const opacity = getMarkerOpacity(marker.apartmentCount);
          
          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 hover:z-30"
              style={{
                left: `${marker.position.x}%`,
                top: `${marker.position.y}%`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: Math.floor(opacity * 15) + 10,
              }}
              onClick={() => onMarkerClick && onMarkerClick(marker)}
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              {/* Theme-colored marker - teardrop shape with white border */}
              <div
                className="w-full h-full flex items-center justify-center text-white font-black relative"
                style={{
                  background: `linear-gradient(135deg, #475569 0%, #334155 100%)`, // Using slate-600 and slate-700 theme colors
                  fontSize: `${Math.max(size / 3.5, 12)}px`,
                  clipPath: 'circle(50% at 50% 40%)',
                  border: '3px solid white',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg)',
                }}
              >
                <span style={{ transform: 'rotate(45deg)', fontWeight: '900', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  {formatApartmentCount(marker.apartmentCount)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Enhanced Hover Tooltip */}
        {hoveredMarker && (
          <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 pointer-events-none"
            style={{
              left: mousePosition.x + 15,
              top: mousePosition.y - 15,
              transform: 'translateY(-100%)',
            }}
          >
            <h3 className="font-bold text-gray-900 mb-2 text-lg">
              {hoveredMarker.city}, {hoveredMarker.state}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-6">
                <span className="text-gray-600">Available Apartments:</span>
                <span className="font-bold text-gray-900">
                  {hoveredMarker.apartmentCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-600">Average Rent:</span>
                <span className="font-bold text-green-600">
                  ${hoveredMarker.averagePrice.toLocaleString()}/mo
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-blue-600 font-medium">Click to search apartments in this area</p>
            </div>
          </div>
        )}
      </div>

      {/* Google Maps Style Legend */}
      <div className="absolute top-4 right-4 bg-white shadow-2xl rounded-lg p-4 z-50 max-w-xs border border-gray-300">
        <h3 className="font-bold text-gray-900 mb-3 text-base">🏠 Apartment Density Map</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-5 h-5 border-2 border-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)'
              }}
            ></div>
            <span className="text-sm text-gray-700 font-medium">Small Cities (500-10K)</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 border-2 border-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)'
              }}
            ></div>
            <span className="text-sm text-gray-700 font-medium">Major Cities (10K-50K)</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-7 h-7 border-3 border-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)'
              }}
            ></div>
            <span className="text-sm text-gray-700 font-medium">Metro Areas (50K+)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-slate-600 font-semibold">
            ✓ Theme Colors • Google Maps Style
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Large visible markers • All 50 states coverage
          </p>
        </div>
      </div>

      {/* Enhanced Stats Panel */}
      <div className="absolute bottom-4 left-4 bg-white shadow-xl rounded-xl px-6 py-4 z-50 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-600">
              {densityData.length.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-medium">Locations</p>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.floor(densityData.reduce((sum, marker) => sum + marker.apartmentCount, 0) / 1000)}K+
            </p>
            <p className="text-xs text-gray-500 font-medium">Apartments</p>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">50</p>
            <p className="text-xs text-gray-500 font-medium">States + DC</p>
          </div>
        </div>
      </div>

      {/* Compass Rose - Enhanced */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-full p-4 shadow-xl border border-gray-200">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm font-bold text-gray-800">N</div>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
            <div className="text-sm font-semibold text-gray-600">E</div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2">
            <div className="text-sm font-semibold text-gray-600">S</div>
          </div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2">
            <div className="text-sm font-semibold text-gray-600">W</div>
          </div>
          <div className="absolute inset-0 border-3 border-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-red-500 transform -translate-x-1/2 -translate-y-4 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default USMapWithDensityComplete;
