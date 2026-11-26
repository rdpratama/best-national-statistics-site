# Statistik Indonesia — National Statistics Explorer

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/rdpratama/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/rdpratama/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for **Indonesia**: population, economy, health, education, work and connectivity, each figure labelled with its source and year. Every number comes from the World Bank's World Development Indicators (accessed 26 November 2026), covering 2015–2024.

## What it does

- **Home dashboard** — seventeen headline indicators with year-on-year change, a search box that finds any indicator, and a ten-year GDP growth chart.
- **Six section pages** (hash routes, each reached by a link) — Population, Economy, Health, Education, Work, Connectivity — each with indicator cards and real canvas charts with a 2015–2024 / 2020–2024 year-range selector.
- **Compare ASEAN** — Indonesia against Malaysia, Singapore, Thailand, Vietnam and the Philippines, as a bar chart (toggle GDP per capita / population) and a table.
- **Phone layout** — the same pages reflow for a phone screen; one screenshot shows it.
- **Offline by design** — static files under `app/`, no network requests, no framework. Charts are plain canvas JavaScript; type is system serif/sans.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`.

## Screenshots

`shots.json` lists the four screenshots in `screenshots/`: the home dashboard, the economy page, the ASEAN comparison, and the home page at phone size.

## License

MIT — see [LICENSE](LICENSE).
