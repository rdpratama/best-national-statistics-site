// Statistik Indonesia — hash router, section pages, search and charts.
// Every figure shown carries its source and year; charts draw from data.js.
import { YEARS, SOURCE, INDICATORS, LITERACY, LAND_AREA_SQKM, ASEAN, latest, previous, formatValue } from './data.js';
import { drawLineChart, drawBarChart } from './charts.js';

const app = document.getElementById('app');

function srcLine(year) {
  return 'Source: ' + SOURCE + ', ' + year;
}

function deltaHtml(indicator, lowerIsBetter) {
  const now = latest(indicator);
  const before = previous(indicator);
  const diff = now - before;
  if (diff === 0) return '<p class="delta">Unchanged on ' + (YEARS[YEARS.length - 2]) + '</p>';
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  const arrow = diff > 0 ? '▲' : '▼';
  const cls = good ? 'up' : 'down';
  const shown = indicator.format === 'millions' || indicator.format === 'billions' || indicator.format === 'dollars'
    ? (Math.abs(diff) >= 1 ? formatValue(indicator, Math.abs(diff)) : formatValue(indicator, Math.abs(diff)))
    : Math.abs(diff).toFixed(2) + ' pp';
  return '<p class="delta"><span class="' + cls + '">' + arrow + ' ' + shown + '</span> on ' + YEARS[YEARS.length - 2] + '</p>';
}

function statCard(key, lowerIsBetter) {
  const ind = INDICATORS[key];
  return '<article class="card">' +
    '<p class="label">' + ind.label + '</p>' +
    '<p class="value">' + formatValue(ind, latest(ind)) + '</p>' +
    '<p class="unit">' + ind.unit + '</p>' +
    deltaHtml(ind, !!lowerIsBetter) +
    '<p class="source">' + srcLine(YEARS[YEARS.length - 1]) + ' · ' + ind.code + '</p>' +
    '</article>';
}

function chartPanel(key, title, blurb) {
  const ind = INDICATORS[key];
  return '<section class="panel" data-chart="' + key + '">' +
    '<h3>' + title + '</h3>' +
    '<p>' + blurb + ' ' + srcLine('2015–2024') + '.</p>' +
    '<div class="range" role="group" aria-label="Year range">' +
    '<button type="button" data-range="all" aria-pressed="true">2015–2024</button>' +
    '<button type="button" data-range="recent" aria-pressed="false">2020–2024</button>' +
    '</div>' +
    '<div class="chart-wrap"><canvas class="chart" width="960" height="320" aria-label="Chart of ' + ind.label + ', 2015 to 2024"></canvas></div>' +
    '<p class="note">Latest: ' + formatValue(ind, latest(ind)) + ' (' + YEARS[YEARS.length - 1] + '). ' + ind.code + '.</p>' +
    '</section>';
}

function drawPanelCharts(scope) {
  scope.querySelectorAll('[data-chart]').forEach((panel) => {
    const key = panel.getAttribute('data-chart');
    const ind = INDICATORS[key];
    const canvas = panel.querySelector('canvas');
    const buttons = panel.querySelectorAll('[data-range]');
    const draw = (range) => {
      const start = range === 'recent' ? 5 : 0;
      drawLineChart(canvas, YEARS.slice(start), ind.values.slice(start), ind);
    };
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        draw(btn.getAttribute('data-range'));
      });
    });
    draw('all');
  });
}

function sectionPage(eyebrow, title, intro, cardsHtml, panelsHtml) {
  return '<p class="eyebrow">' + eyebrow + '</p>' +
    '<h2>' + title + '</h2>' +
    '<p class="section-intro">' + intro + '</p>' +
    '<div class="cards">' + cardsHtml + '</div>' +
    panelsHtml;
}

function homeView() {
  const rows = Object.entries(INDICATORS).map(([key, ind], i) =>
    '<li data-name="' + ind.label.toLowerCase() + ' ' + ind.code.toLowerCase() + '"' + (i >= 3 ? ' style="display:none"' : '') + '>' +
    '<span><strong>' + ind.label + '</strong><br><span class="src">' + srcLine('2024') + ' · ' + ind.code + '</span></span>' +
    '<span class="fig">' + formatValue(ind, latest(ind)) + '</span></li>').join('');
  return '<p class="eyebrow">Indonesia · 2015–2024</p>' +
    '<h2>Indonesia at a glance</h2>' +
    '<p class="section-intro">Seventeen headline indicators, one country. Search any indicator, open a section for its ten-year trend, or compare Indonesia with its ASEAN neighbours.</p>' +
    '<div class="search"><label for="q">Search an indicator</label>' +
    '<input id="q" type="search" placeholder="Try “inflation”, “internet” or “GDP”… " autocomplete="off"></div>' +
    '<ul class="search-results" id="results">' + rows + '</ul>' +
    '<div class="cards">' +
    statCard('population') + statCard('gdp') + statCard('gdpPerCapita') + statCard('gdpGrowth') +
    statCard('lifeExpectancy') + statCard('unemployment', true) + statCard('inflation', true) +
    '</div>' +
    '<div class="bignum-strip">' +
    '<div><div class="n">' + LAND_AREA_SQKM.toLocaleString('en-US') + '</div><div class="l">sq km land area, 2024</div></div>' +
    '<div><div class="n">' + formatValue(INDICATORS.density, latest(INDICATORS.density)) + '</div><div class="l">people per sq km, 2024</div></div>' +
    '<div><div class="n">' + formatValue(INDICATORS.urban, latest(INDICATORS.urban)) + '</div><div class="l">urban, 2024</div></div>' +
    '<div><div class="n">' + formatValue(INDICATORS.internet, latest(INDICATORS.internet)) + '</div><div class="l">online, 2024</div></div>' +
    '</div>' +
    chartPanel('gdpGrowth', 'Growth held above 5% — except 2020',
      'Indonesia grew every year of the decade except the pandemic year 2020, when GDP shrank 2.07%. Growth returned above 5% in 2022 and stayed there.') +
    '<h3>Explore by section</h3>' +
    '<div class="link-grid">' +
    '<a href="#/population"><b>Population</b><span>283.5 million people, slowing growth, an ageing shift.</span></a>' +
    '<a href="#/economy"><b>Economy</b><span>A US$1.4 trillion economy, the largest in Southeast Asia.</span></a>' +
    '<a href="#/health"><b>Health</b><span>Life expectancy 71.3 years; child mortality nearly halved since 2015.</span></a>' +
    '<a href="#/education"><b>Education</b><span>Universal primary enrolment; adult literacy 96%.</span></a>' +
    '<a href="#/work"><b>Work</b><span>Unemployment at 3.30%, its lowest in the decade.</span></a>' +
    '<a href="#/connectivity"><b>Connectivity</b><span>Internet use tripled since 2015 to 72.8%.</span></a>' +
    '<a href="#/compare"><b>Compare ASEAN</b><span>Indonesia against Malaysia, Singapore, Thailand, Vietnam and the Philippines.</span></a>' +
    '</div>';
}

function populationView() {
  return sectionPage('People', 'Population',
    'Indonesia is the world’s fourth most populous country. Growth has slowed from 1.12% a year in 2015 to 0.81% in 2024, while the share aged 65 and over keeps climbing.',
    statCard('population') + statCard('popGrowth', true) + statCard('density') + statCard('fertility', true),
    chartPanel('population', 'Population, 2015–2024', 'Up by 21.7 million people in a decade.') +
    chartPanel('age65', 'The 65+ share keeps rising', 'From 6.08% in 2015 to 7.29% in 2024, while the share of children under 15 fell from 26.97% to 24.60%.') +
    '<section class="panel"><h3>Age structure, 2024</h3>' +
    '<p>Children aged 0–14: <strong>' + formatValue(INDICATORS.age014, latest(INDICATORS.age014)) + '</strong> of the population. ' +
    'People aged 65+: <strong>' + formatValue(INDICATORS.age65, latest(INDICATORS.age65)) + '</strong>. ' +
    'Fertility: <strong>' + formatValue(INDICATORS.fertility, latest(INDICATORS.fertility)) + '</strong> births per woman — close to replacement level. ' + srcLine('2024') + '.</p></section>');
}

function economyView() {
  return sectionPage('Money', 'Economy',
    'Southeast Asia’s largest economy, worth US$1,396 billion in 2024. GDP per capita passed US$4,900, and exports equalled 22.3% of GDP.',
    statCard('gdp') + statCard('gdpPerCapita') + statCard('gdpGrowth') + statCard('exports'),
    chartPanel('gdp', 'GDP, 2015–2024', 'Current US dollars, from US$861bn in 2015 to US$1,396bn in 2024.') +
    chartPanel('gdpPerCapita', 'GDP per capita, 2015–2024', 'From US$3,288 in 2015 to US$4,925 in 2024.') +
    chartPanel('inflation', 'Inflation, 2015–2024', 'Consumer-price inflation fell from 6.36% in 2015 to 2.18% in 2024, with a 2022 spike to 4.21%.'));
}

function healthView() {
  return sectionPage('Wellbeing', 'Health',
    'Indonesians live longer and their children survive more often than a decade ago — though the pandemic years 2020–2021 show up clearly in the life-expectancy line.',
    statCard('lifeExpectancy') + statCard('under5Mortality', true),
    chartPanel('lifeExpectancy', 'Life expectancy at birth, 2015–2024', 'Up from 69.5 years in 2015 to 71.3 in 2024, after dipping to 67.5 in 2021.') +
    chartPanel('under5Mortality', 'Under-5 mortality, 2015–2024', 'Down every single year of the decade, from 26.1 to 17.7 per 1,000 live births.'));
}

function educationView() {
  const points = LITERACY.points.map(([y, v]) => '<li><strong>' + y + ':</strong> ' + v.toFixed(2) + '%</li>').join('');
  return sectionPage('Learning', 'Education',
    'Every child of primary age is in school, and adult literacy reached 96% in the latest available year, 2020.',
    statCard('primaryEnrolment'),
    chartPanel('primaryEnrolment', 'Primary school enrolment (gross), 2015–2024', 'Gross enrolment can pass 100% because it counts pupils outside the official age band; it stood at 100.04% in 2024.') +
    '<section class="panel"><h3>' + LITERACY.label + '</h3>' +
    '<p>' + LITERACY.note + ' ' + srcLine('2015–2020') + '.</p><ul>' + points + '</ul></section>');
}

function workView() {
  return sectionPage('Jobs', 'Work',
    'Unemployment fell to 3.30% in 2024, its lowest reading in the decade, after peaking at 4.51% in 2015 and 4.26% in the pandemic year 2020.',
    statCard('unemployment', true),
    chartPanel('unemployment', 'Unemployment, 2015–2024', 'ILO modelled estimate, % of the total labour force.'));
}

function connectivityView() {
  return sectionPage('Wires &amp; cities', 'Connectivity',
    'Indonesia got online fast: internet use rose from 22.1% of people in 2015 to 72.8% in 2024, while the urban share passed 58%.',
    statCard('internet') + statCard('urban'),
    chartPanel('internet', 'People using the internet, 2015–2024', 'More than tripled in nine years — the steepest climb of any indicator on this site.') +
    chartPanel('urban', 'Urban population, 2015–2024', 'Up from 53.17% to 58.75% of the population.'));
}

function compareView() {
  const rows = ASEAN.map((c) =>
    '<tr' + (c.name === 'Indonesia' ? ' class="hl"' : '') + '><td>' + c.name + '</td><td>' +
    (c.population / 1e6).toFixed(1) + 'm</td><td>US$' + c.gdpPerCapita.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '</td></tr>').join('');
  return '<p class="eyebrow">Six neighbours · 2024</p>' +
    '<h2>Compare ASEAN</h2>' +
    '<p class="section-intro">Indonesia has by far the most people in ASEAN — more than Vietnam and the Philippines combined — but its GDP per capita sits in the middle of the group, well below Malaysia and Singapore.</p>' +
    '<section class="panel"><h3>GDP per capita, 2024</h3>' +
    '<div class="metric-toggle" role="group" aria-label="Comparison metric">' +
    '<button type="button" data-metric="gdp" aria-pressed="true">GDP per capita</button>' +
    '<button type="button" data-metric="pop" aria-pressed="false">Population</button></div>' +
    '<div class="chart-wrap"><canvas class="chart" id="compare-chart" width="960" height="280" aria-label="Bar chart comparing ASEAN countries"></canvas></div>' +
    '<p class="note">' + srcLine('2024') + '. Bars on a log scale: Singapore’s GDP per capita is 19× Indonesia’s, so a linear scale would hide the other five. Indonesia highlighted in amber.</p></section>' +
    '<section class="panel"><h3>The six countries, 2024</h3>' +
    '<table><thead><tr><th>Country</th><th>Population</th><th>GDP per capita</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p class="note">' + srcLine('2024') + '. Figures: World Bank WDI, SP.POP.TOTL and NY.GDP.PCAP.CD.</p></section>';
}

function drawCompare(scope) {
  const canvas = scope.querySelector('#compare-chart');
  if (!canvas) return;
  const buttons = scope.querySelectorAll('[data-metric]');
  const draw = (metric) => {
    const labels = ASEAN.map((c) => c.name);
    if (metric === 'pop') {
      drawBarChart(canvas, labels, ASEAN.map((c) => c.population / 1e6), (v) => v.toFixed(0) + 'm', { height: 280, log: true });
    } else {
      drawBarChart(canvas, labels, ASEAN.map((c) => c.gdpPerCapita), (v) => '$' + Math.round(v).toLocaleString('en-US'), { height: 280, log: true });
    }
  };
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      draw(btn.getAttribute('data-metric'));
    });
  });
  draw('gdp');
}

function wireSearch(scope) {
  const input = scope.querySelector('#q');
  const list = scope.querySelector('#results');
  if (!input || !list) return;
  const items = [...list.querySelectorAll('li')];
  const note = document.createElement('p');
  note.className = 'note';
  note.hidden = true;
  list.after(note);
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((li, i) => {
      // With no query, show the first three headline indicators; while
      // searching, show the first eight matches.
      const hit = !q ? i < 3 : li.getAttribute('data-name').includes(q);
      const capped = q && shown >= 8;
      li.style.display = hit && !capped ? '' : 'none';
      if (hit && !capped) shown += 1;
    });
    if (q && shown === 0) {
      note.textContent = 'No indicator matches "' + input.value + '". Try "population", "GDP" or "internet".';
      note.hidden = false;
    } else {
      note.hidden = true;
    }
  });
}

const ROUTES = {
  '': homeView,
  'population': populationView,
  'economy': economyView,
  'health': healthView,
  'education': educationView,
  'work': workView,
  'connectivity': connectivityView,
  'compare': compareView,
};

function render() {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  const view = ROUTES[route] || homeView;
  app.innerHTML = view();
  document.querySelectorAll('.mainnav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-route') === route);
  });
  drawPanelCharts(app);
  drawCompare(app);
  wireSearch(app);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
