export const VEHICLES = [
  { make: 'Toyota', model: 'Camry', yearFrom: 2007, yearTo: 2011 },
  { make: 'Toyota', model: 'Corolla', yearFrom: 2010, yearTo: 2016 },
  { make: 'Toyota', model: 'Corolla', yearFrom: 2014, yearTo: 2019 },
  { make: 'Toyota', model: 'Camry', yearFrom: 2008, yearTo: 2012 },
  { make: 'Honda', model: 'Accord', yearFrom: 2008, yearTo: 2012 },
  { make: 'Lexus', model: 'RX 330', yearFrom: 2004, yearTo: 2006 },
  { make: 'Toyota', model: 'Hilux', yearFrom: 2012, yearTo: 2015 },
  { make: 'Toyota', model: 'Highlander', yearFrom: 2003, yearTo: 2007 },
]

export const vehicleLabel = (v) => `${v.make} ${v.model} ${v.yearFrom}-${v.yearTo}`

export const VEHICLE_LABELS = VEHICLES.map(vehicleLabel)

export const vehicleFromLabel = (label) =>
  VEHICLES.find(v => vehicleLabel(v) === label) || null