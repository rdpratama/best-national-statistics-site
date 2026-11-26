// Verified figures for Indonesia, World Bank World Development Indicators,
// accessed 26 November 2026 (dataset last updated 11 November 2026).
// Every series runs 2015-2024 unless a note says otherwise. Values are
// stored oldest-first so charts read left to right.
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SOURCE = 'World Bank WDI';

function series(code, label, unit, values, format, note) {
  return { code, label, unit, values, format, note: note || '' };
}

export const INDICATORS = {
  population: series('SP.POP.TOTL', 'Population', 'people',
    [261799249, 264627418, 267346658, 269951846, 272489381, 274814866, 276758053, 278830529, 281190067, 283487931],
    'millions'),
  popGrowth: series('SP.POP.GROW', 'Population growth', '% per year',
    [1.12, 1.07, 1.02, 0.97, 0.94, 0.85, 0.70, 0.75, 0.84, 0.81], 'pct1'),
  density: series('EN.POP.DNST', 'Population density', 'people per sq km',
    [139.44, 140.95, 142.39, 143.78, 145.13, 146.37, 146.24, 147.33, 148.59, 149.80], 'pct1'),
  gdp: series('NY.GDP.MKTP.CD', 'GDP (current US$)', 'US$ billion',
    [860.85, 931.88, 1015.62, 1042.27, 1119.10, 1059.05, 1186.51, 1319.10, 1371.17, 1396.30], 'billions'),
  gdpPerCapita: series('NY.GDP.PCAP.CD', 'GDP per capita', 'US$',
    [3288.22, 3521.47, 3798.88, 3860.95, 4106.95, 3853.70, 4287.17, 4730.83, 4876.30, 4925.44], 'dollars'),
  gdpGrowth: series('NY.GDP.MKTP.KD.ZG', 'GDP growth', '% per year',
    [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03], 'pct2'),
  lifeExpectancy: series('SP.DYN.LE00.IN', 'Life expectancy at birth', 'years',
    [69.52, 69.73, 69.95, 70.08, 70.35, 68.82, 67.45, 70.93, 71.15, 71.29], 'pct1'),
  under5Mortality: series('SH.DYN.MORT', 'Under-5 mortality', 'per 1,000 live births',
    [26.1, 25.0, 23.8, 22.8, 21.8, 20.8, 19.9, 19.1, 18.4, 17.7], 'pct1'),
  unemployment: series('SL.UEM.TOTL.ZS', 'Unemployment (ILO modelled)', '% of labour force',
    [4.51, 4.30, 3.78, 4.39, 3.59, 4.26, 3.83, 3.46, 3.31, 3.30], 'pct2'),
  inflation: series('FP.CPI.TOTL.ZG', 'Inflation (consumer prices)', '% per year',
    [6.36, 3.53, 3.81, 3.20, 3.03, 1.92, 1.56, 4.21, 3.67, 2.18], 'pct2'),
  urban: series('SP.URB.TOTL.IN.ZS', 'Urban population', '% of population',
    [53.17, 53.81, 54.45, 55.10, 55.74, 56.28, 56.88, 57.49, 58.12, 58.75], 'pct1'),
  internet: series('IT.NET.USER.ZS', 'People using the internet', '% of population',
    [22.06, 25.45, 32.34, 39.90, 47.69, 53.73, 62.10, 66.48, 69.21, 72.78], 'pct1'),
  primaryEnrolment: series('SE.PRM.ENRR', 'Primary school enrolment (gross)', '% of school-age children',
    [107.98, 105.92, 104.38, 103.30, 101.26, 100.95, 100.31, 98.70, 98.16, 100.04], 'pct1'),
  exports: series('NE.EXP.GNFS.ZS', 'Exports of goods and services', '% of GDP',
    [21.16, 19.09, 20.18, 21.00, 18.59, 17.33, 21.42, 24.50, 21.81, 22.31], 'pct1'),
  fertility: series('SP.DYN.TFRT.IN', 'Fertility rate', 'births per woman',
    [2.35, 2.31, 2.25, 2.22, 2.21, 2.19, 2.17, 2.15, 2.13, 2.12], 'pct2'),
  age014: series('SP.POP.0014.TO.ZS', 'Population aged 0–14', '% of population',
    [26.97, 26.77, 26.56, 26.33, 26.09, 25.83, 25.58, 25.27, 24.93, 24.60], 'pct1'),
  age65: series('SP.POP.65UP.TO.ZS', 'Population aged 65+', '% of population',
    [6.08, 6.15, 6.24, 6.35, 6.49, 6.61, 6.69, 6.82, 7.05, 7.29], 'pct1'),
};

// Adult literacy is only published for scattered years; keep it as points, not a line.
export const LITERACY = {
  label: 'Adult literacy rate',
  unit: '% of people aged 15+',
  points: [[2015, 95.22], [2016, 95.38], [2018, 95.66], [2020, 96.0]],
  note: 'Latest available year: 2020.',
};

// Land area is near-constant; show the 2024 figure as a single fact.
export const LAND_AREA_SQKM = 1892410;

// ASEAN neighbours, 2024, same World Bank source.
export const ASEAN = [
  { name: 'Indonesia', population: 283487931, gdpPerCapita: 4925.44 },
  { name: 'Malaysia', population: 35557673, gdpPerCapita: 11874.43 },
  { name: 'Singapore', population: 6036860, gdpPerCapita: 94896.56 },
  { name: 'Thailand', population: 71668011, gdpPerCapita: 7386.64 },
  { name: 'Vietnam', population: 100987686, gdpPerCapita: 4716.66 },
  { name: 'Philippines', population: 115843670, gdpPerCapita: 3985.29 },
];

export function latest(indicator) {
  return indicator.values[indicator.values.length - 1];
}

export function previous(indicator) {
  return indicator.values[indicator.values.length - 2];
}

export function formatValue(indicator, value) {
  switch (indicator.format) {
    case 'millions': return (value / 1e6).toFixed(1) + ' million';
    case 'billions': return 'US$' + value.toFixed(1) + 'bn';
    case 'dollars': return 'US$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    case 'pct1': return value.toFixed(1) + '%';
    case 'pct2': return value.toFixed(2) + '%';
    default: return String(value);
  }
}

export function formatAxis(indicator, value) {
  if (indicator.format === 'millions') return (value / 1e6).toFixed(0) + 'm';
  if (indicator.format === 'billions') return '$' + value.toFixed(0) + 'bn';
  if (indicator.format === 'dollars') return '$' + Math.round(value).toLocaleString('en-US');
  if (indicator.format === 'pct1') return value.toFixed(0) + '%';
  if (indicator.format === 'pct2') return value.toFixed(1) + '%';
  return String(value);
}
