# Broken Links

## Question

Du willst mit deinem Programm alle defekten Links einer Website finden. Erläutere kurz, wie du dieses Problem angehen würdest und welche Bibliotheken du verwenden würdest. Webcrawler werden oft von Websites blockiert. Wie würdest du verhindern, dass dein Prüfprogramm für defekte Links blockiert wird?
Du musst keinen Code schreiben, nur Text.

### How to find broken links

- 1. Extract HTML from a Website
- 2. Find all links in the HTML
- 3. Filter links to remove remove duplications
- 4. Resolve relative URLs to absolute
- 5. Use fetch to make calls to the links
- 6. check for status codes (200-399 is ok, 4xx/5xx is broken, 429 -> try again later)
- 7. Cache already checked URLs
- 8. Generate a report (csv/json)

### How to avoid being blocked

- 1. Set realistic `User-Agent`/`Accept-Language`
- 2. Rotate User-Agent only if allowed
- 3. Cache already checked URLs
- 4. Throttle requests
- 5. Randomize intervals
