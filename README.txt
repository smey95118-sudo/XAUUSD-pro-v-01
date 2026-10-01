XAU/USD PRO V1

Features:
- Live XAU/USD market data from Twelve Data
- Candlestick chart
- Timeframes: 1m, 5m, 15m, 1H, 4H, 1D
- 30-second auto refresh
- Mobile responsive UI
- API key stored locally in the browser for personal testing

GitHub Pages:
1. Extract this ZIP.
2. Upload index.html, app.js, style.css, manifest.json to the ROOT of your repository.
3. Settings > Pages > Deploy from branch > main > /(root).
4. Open the generated GitHub Pages URL.
5. Tap ⚙ and paste your Twelve Data API key.

Important:
- Do not commit your API key into GitHub.
- REST candle data can have some delay after a candle closes. For lower-latency streaming, a later version can use Twelve Data WebSocket.
