# o2b2-certificate-authorities-market-share
Estimates the market share of certificate authorities of Open Finance Brasil

## Metodology
1) Reads the [partipants url](https://data.directory.openbankingbrasil.org.br/participants) and extract all distinct hosts from declared APIs of payments-consents or consents family, extract the client certificate from each host and show the results grouped by CA.

2) Reads the well-known of each authorization server, extract the client certificate of the authorization_endpoint and show the results grouped by CA.

## Most recent results

Results in 15/04/2025
```
mTLS protected endpoints results: 
{
  total: 133,
  'AC Certisign ICP-Brasil SSL EV G4': 27,
  'AC SERASA SSL EV V4': 2,
  'AC SOLUTI SSL EV G4': 97,
  'AC VALID SSL EV': 4,
  'Autoridade Certificadora do SERPRO SSLv1': 2,
  'Openway TLS': 1
}
non-protected endpoints results:
{
  total: 208,
  'AC Certisign ICP-Brasil SSL EV G4': 1,
  'AC SOLUTI SSL EV G4': 4,
  'AC VALID SSL EV': 1,
  'Amazon RSA 2048 M02': 51,
  'Amazon RSA 2048 M03': 4,
  'Autoridade Certificadora do SERPRO SSLv1': 1,
  'COMODO RSA Extended Validation Secure Server CA': 1,
  'DigiCert EV RSA CA G2': 7,
  'DigiCert Global G2 TLS RSA SHA256 2020 CA1': 3,
  'DigiCert SHA2 Extended Validation Server CA': 7,
  'DigiCert TLS Hybrid ECC SHA384 2020 CA1': 1,
  'DigiCert TLS RSA SHA256 2020 CA1': 12,
  'E-SAFER DOMAIN SSL CA  [Run by the Issuer]': 1,
  'E-SAFER EXTENDED SSL CA  [Run by the Issuer]': 8,
  E5: 2,
  E6: 2,
  'Entrust Certification Authority - L1K': 1,
  'GeoTrust EV RSA CA G2': 2,
  'GeoTrust RSA CN CA G2': 1,
  'GeoTrust TLS RSA CA G1': 3,
  'GlobalSign Extended Validation CA - SHA256 - G3': 19,
  'GlobalSign RSA OV SSL CA 2018': 6,
  'Go Daddy Secure Certificate Authority - G2': 5,
  'Openway TLS': 1,
  R10: 7,
  R11: 19,
  'RapidSSL TLS RSA CA G1': 1,
  'Sectigo RSA Extended Validation Secure Server CA': 1,
  'Sectigo RSA Organization Validation Secure Server CA': 3,
  'Site Blindado RSA Domain Validation Secure Server CA 3': 1,
  'Soluti CA - DV': 2,
  'Soluti CA - EV': 15,
  'Thawte TLS RSA CA G1': 2,
  'TrustSign BR RSA DV SSL CA 3': 1,
  'Valid Certificadora RSA EV SSL CA': 5,
  WE1: 3,
  WR3: 2,
  'ZeroSSL RSA Domain Secure Site CA': 2
}
```

## How to run
```
npm install
node index.js
```
