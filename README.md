# ottolillebo.github.io

Personlig forskningsside for Otto Sevaldson Lillebø.

## Lokal forhåndsvisning

Nettsiden har ingen byggetrinn eller avhengigheter. Kjør en enkel lokal webserver i prosjektmappen, for eksempel:

```powershell
python -m http.server 8080
```

Åpne deretter `http://localhost:8080`.

## Oppdatere innhold

- Hovedinnholdet ligger i `index.html`.
- Designet ligger i `styles.css`.
- Språkbytte og GitHub-repoer håndteres i `script.js`.
- Offentlige repoer fra `ottolillebo` vises automatisk, sortert etter siste oppdatering.

## Publisering

GitHub Actions-filen i `.github/workflows/pages.yml` publiserer siden automatisk ved push til `main`. I repoets innstillinger må **Settings → Pages → Source** stå på **GitHub Actions**.
