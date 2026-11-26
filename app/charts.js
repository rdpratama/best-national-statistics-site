// Plain-canvas charts, no library. Every chart draws its axes, gridlines,
// year labels and values from the series it is given, so a screenshot
// always shows a real, readable chart.
import { formatAxis } from './data.js';

const TEAL = '#0b3b3e';
const AMBER = '#e8a33d';
const GRID = '#ddd5c2';
const MUTED = '#5c6b6a';

function setupCanvas(canvas, width, height) {
  const scale = 2; // crisp on retina and in screenshots
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.font = '12px "Segoe UI", system-ui, sans-serif';
  return ctx;
}

function niceBounds(values) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12;
  min -= pad;
  max += pad;
  if (min < 0 && Math.min(...values) >= 0) min = 0;
  return { min, max };
}

export function drawLineChart(canvas, years, values, indicator, options) {
  const opts = options || {};
  const width = opts.width || 960;
  const height = opts.height || 320;
  const ctx = setupCanvas(canvas, width, height);
  const padL = 64, padR = 16, padT = 14, padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const { min, max } = niceBounds(values);
  const x = (i) => padL + (i / (years.length - 1)) * plotW;
  const y = (v) => padT + (1 - (v - min) / (max - min)) * plotH;

  // Gridlines and y labels.
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = min + ((max - min) * t) / ticks;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(padL, yy);
    ctx.lineTo(width - padR, yy);
    ctx.stroke();
    ctx.fillText(formatAxis(indicator, v), padL - 8, yy);
  }

  // Zero line when the series crosses it (e.g. GDP growth in 2020).
  if (min < 0 && max > 0) {
    ctx.strokeStyle = '#b3402a';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, y(0));
    ctx.lineTo(width - padR, y(0));
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Line and points.
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((v, i) => { if (i === 0) ctx.moveTo(x(i), y(v)); else ctx.lineTo(x(i), y(v)); });
  ctx.stroke();
  ctx.fillStyle = AMBER;
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(v), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Year labels and the latest value.
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  years.forEach((yr, i) => {
    if (i % 2 === 0 || i === years.length - 1) ctx.fillText(String(yr), x(i), height - padB + 8);
  });
  ctx.fillStyle = TEAL;
  ctx.font = 'bold 13px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(formatAxis(indicator, values[values.length - 1]) + ' in ' + years[years.length - 1],
    padL, padT - 2);
}

export function drawBarChart(canvas, labels, values, format, options) {
  const opts = options || {};
  const width = opts.width || 960;
  const height = opts.height || 340;
  const ctx = setupCanvas(canvas, width, height);
  const padL = 64, padR = 16, padT = 30, padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  // With a log scale the bars show values spanning a wide range (Singapore's
  // GDP per capita is 19x Indonesia's); gridlines are labelled in real units.
  const useLog = !!opts.log;
  const shown = useLog ? values.map((v) => Math.log10(v)) : values;
  const lo = useLog ? Math.floor(Math.min(...shown)) : 0;
  const hi = useLog ? Math.ceil(Math.max(...shown)) : Math.max(...values) * 1.08;
  const span = hi - lo;

  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  if (useLog) {
    for (let d = lo; d <= hi; d++) {
      const yy = padT + (1 - (d - lo) / span) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(width - padR, yy);
      ctx.stroke();
      ctx.fillText(format(Math.pow(10, d)), padL - 8, yy);
    }
  } else {
    for (let t = 0; t <= 4; t++) {
      const v = (hi * t) / 4;
      const yy = padT + (1 - t / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(width - padR, yy);
      ctx.stroke();
      ctx.fillText(format(v), padL - 8, yy);
    }
  }

  const slot = plotW / labels.length;
  const barW = Math.min(64, slot * 0.6);
  labels.forEach((label, i) => {
    const v = values[i];
    const h = ((shown[i] - lo) / span) * plotH;
    const bx = padL + i * slot + (slot - barW) / 2;
    const by = padT + plotH - h;
    const isIdn = label === 'Indonesia';
    ctx.fillStyle = isIdn ? AMBER : TEAL;
    ctx.fillRect(bx, by, barW, h);
    ctx.fillStyle = TEAL;
    ctx.font = 'bold 12px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(format(v), bx + barW / 2, by - 4);
    ctx.fillStyle = MUTED;
    ctx.font = '12px "Segoe UI", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(label, bx + barW / 2, padT + plotH + 8);
  });
}
