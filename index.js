process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import tls from 'tls';
import net from 'net';
import { X509Certificate } from 'node:crypto'

const getCertificate = async function (host, port = 443) {
    return new Promise((resolve, reject) => {
      const socket = net.connect(port, host, () => {
        const tlsSocket = tls.connect(
          {
            socket,
            servername: host,
            rejectUnauthorized: false,
          },
          () => {
            const certificate = tlsSocket.getPeerCertificate();
            tlsSocket.end();
  
            if (certificate && Object.keys(certificate).length > 0) {
                var x509Cert = new X509Certificate(certificate.raw);
                resolve(x509Cert);
            } else {
              reject(new Error("Nenhum certificado encontrado."));
            }
          }
        );
  
        tlsSocket.on("error", (err) => reject(err));
      });
  
      socket.on("error", (err) => reject(err));
    });
}

const getMtlsEndpointsFromDirectory = async function(participants) {
    //const participants = await getParticipantsFromDirectory(environment);
    const mtlsHosts = [];
    for (const org of participants) {
        for (var i=0;i<org.AuthorisationServers.length;i++) {
            const as = org.AuthorisationServers[i];
            for (var j=0;j<as.ApiResources.length;j++) {
                const api = as.ApiResources[j];
                if (["payments-consents", "consents"].includes(api.ApiFamilyType)) {
                    try {
                        const url = new URL(api.ApiDiscoveryEndpoints[0]?.ApiEndpoint);
                        mtlsHosts.push(url.host);
                        break;
                    } catch (e) {
                        console.error("Erro ao tentar extrair o host do endpoint: ", api.ApiDiscoveryEndpoints[0]);
                    }
                    
                }
            }
        }
    }
    return [...new Set(mtlsHosts)];
}

const getAuthorizationEndpointsFromParticipants = async function(participants) {
    //const participants = await getParticipantsFromDirectory(environment);
    const authorizationEndpoints = [];
    //const participants = temp_participants;
    for (const org of participants) {
        for (var i=0;i<org.AuthorisationServers.length;i++) {
            try {
                const res = await fetch(org.AuthorisationServers[i].OpenIDDiscoveryDocument);
                const wellknown = await res.json();
                const url = new URL(wellknown.authorization_endpoint);
                authorizationEndpoints.push(url.host);
                console.log(`Endpoint de autorização encontrado: ${wellknown.authorization_endpoint}`);
            } catch (e) {
                console.error("Erro ao tentar extrair o authorization_endpoint do endpoint: ", org.AuthorisationServers[i].OpenIDDiscoveryDocument);
            }
        }
    }
    return [...new Set(authorizationEndpoints)];
}

const getParticipantsFromDirectory = async function(environment) {
    const directoryParticipantsUrl = environment == "sandbox" ? "https://data.sandbox.directory.openbankingbrasil.org.br/participants" : "https://data.directory.openbankingbrasil.org.br/participants";
    const res = await fetch(directoryParticipantsUrl);
    const participants = await res.json();

    return participants;
}

const sort = function(data) {
    const { total, ...rest } = data;

    const sorted = Object.fromEntries(
      Object.entries(rest).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
    
    const final = { total, ...sorted };

    return final;
}

const start = async function() {
    let resultsProtectedEndpoints = {
        'total': 0
    };
    let resultsUnprotectedEndpoints = {
        'total': 0
    };

    const participants = await getParticipantsFromDirectory("production");

    const mtlsHosts = await getMtlsEndpointsFromDirectory(participants);
    for (const host of mtlsHosts) {
        try {
            const cert = await getCertificate(host);
            if (resultsProtectedEndpoints[cert.toLegacyObject().issuer.CN]) {
                resultsProtectedEndpoints[cert.toLegacyObject().issuer.CN]++;
                resultsProtectedEndpoints['total']++;
            } else {
                resultsProtectedEndpoints[cert.toLegacyObject().issuer.CN] = 1;
                resultsProtectedEndpoints['total']++;
            }
            
            console.log(`Certificado do host ${host} obtido com sucesso.`);
            console.log(cert.toLegacyObject().issuer.CN);
        } catch (e) {
            console.error(`Erro ao obter certificado do host ${host}: `, e);
        }
    }

    const authorizationEndpoints = await getAuthorizationEndpointsFromParticipants(participants);
    for (const host of authorizationEndpoints) {
        try {
            const cert = await getCertificate(host);
            if (resultsUnprotectedEndpoints[cert.toLegacyObject().issuer.CN]) {
                resultsUnprotectedEndpoints[cert.toLegacyObject().issuer.CN]++;
                resultsUnprotectedEndpoints['total']++;
            } else {
                resultsUnprotectedEndpoints[cert.toLegacyObject().issuer.CN] = 1;
                resultsUnprotectedEndpoints['total']++;
            }
            
            console.log(`Certificado do host ${host} obtido com sucesso.`);
            console.log(cert.toLegacyObject().issuer.CN);
        } catch (e) {
            console.error(`Erro ao obter certificado do host ${host}: `, e);
        }
    }

    return [sort(resultsProtectedEndpoints), sort(resultsUnprotectedEndpoints)];
}

const results = await start();
console.log("mTLS protected endpoints results: ");
console.log(results[0]);
console.log("non-protected endpoints results: ");
console.log(results[1]);
