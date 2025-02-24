# o2b2-certificate-authorities-market-share
Estimates the market share of certificate authorities of Open Finance Brasil

## Metodology
1) Reads the [partipants url](https://data.directory.openbankingbrasil.org.br/participants) and extract all distinct hosts from declared APIs of payments-consents or consents family

2) Extract the client certificate from each host


## Most recent results

Results in 23/02/2025
```json
{
  total: 131,
  'AC SOLUTI SSL EV G4': 99,
  'AC Certisign ICP-Brasil SSL EV G4': 23,
  'AC SERASA SSL EV V4': 5,
  'Autoridade Certificadora do SERPRO SSLv1': 2,
  'AC VALID SSL EV': 2
}
```

## How to run
```
npm install
node index.js
```