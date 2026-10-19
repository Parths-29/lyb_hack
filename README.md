# Plant X Energy Advisor

Advisory energy recommendations for one plant. A person approves every change. The live site is the Next.js app at the repository root: [lybhack.vercel.app](https://lybhack.vercel.app/).

Synthetic data only. Nothing here writes a set-point, and this app does not call the architecture backends further down the repo.

```bash
npm install
npm run dev
npm run check
```

Open http://localhost:3000. Refresh clears decisions. No environment variables.

## The page

One content rail, 1120px wide with a 20px gutter, runs through every section. The nav, the hero, the figures, the board, the chart, the sensitivity block, and the footer share that left and right edge.

### Nav

Plant X returns to the top. “Energy Advisor” sits in the center on wide screens. The yellow **Illustrative** label stays on the right. The bar turns solid after a short scroll.

### Hero

“Advisory only.” states the rule. Three chips repeat it: a person approves, the band holds, and anything outside stays blocked. The card on the right is the same idea drawn out: Approve, a human check, and a proven-region bar with one point inside and one blocked.

### Plant figures

Five figures sit on the rail under the hero.

| Figure | What it is |
| --- | --- |
| SEC | Specific energy for the 30-day period, kWh per tonne |
| Annual benefit | ₹80 crore spend × savings potential × realisation |
| Realised | The realisation slider, default 60% |
| Payback | ₹2 crore investment against that annual benefit |
| Committed | ₹/day from cards a person has approved |

Approving a card changes Committed only. It does not move annual benefit, payback, or the chart.

### Recommendations

Eight synthetic options across four levers: Waste, Load, Time-shift, and Set-point. Filter chips narrow the list. The selected card opens beside the list on a wide screen and below it on a narrow one. Tapping a row on a narrow screen scrolls to that card.

Approve is available when the proposal is inside the proven region, or when it does not touch a set-point. A point outside the band cannot be approved. Override needs a written reason. Undo removes the decision. The log beside the card keeps two example rows, then the decisions made in this session.

### Chart

Thirty days of specific energy, baseline against actual. Saving is energy per tonne, not raw energy. Day 18 is a low-production day: output falls, raw energy falls with it, and the normalized saving is ₹0.

### Sensitivity

Two sliders, savings potential and realisation. Default 5% and 60% gives ₹2.4 crore a year and a 10-month payback. At 30% realisation the payback is 20 months and still positive. Option A beats this plan when a lost day exceeds about ₹80 lakh.

### Footer

Four figures close the page: 8 recommendations, 4 levers, the local score (saving × confidence), and the proven-region check, which is ordinary code and does not use that score. The line under them says the data is synthetic, no trained model is running, and the decisions and figures belong to the team.

## Numbers

Three systems stay separate.

- Deck math: annual benefit and payback, from the sliders.
- The chart: a fixed 30-day series. Day 18 saves ₹0.
- Committed ₹/day: approved cards only. Overrides and the example log rows do not count.

## Other demos in this repo

`frontend/`, `monolith/`, `three-tier/`, and `microservices/` are the DesiCane architecture comparison. They are not what the live URL serves. See [`docs/devops-demo.md`](docs/devops-demo.md) for the Redis, Prometheus, and Grafana walkthrough.
