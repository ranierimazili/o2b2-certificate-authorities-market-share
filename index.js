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

const getMtlsEndpointsFromDirectory = async function(environment) {
    const participants = await getParticipantsFromDirectory(environment);
    const mtlsHosts = [];
    //const participants = temp_participants;
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

const getParticipantsFromDirectory = async function(environment) {
    const directoryParticipantsUrl = environment == "sandbox" ? "https://data.sandbox.directory.openbankingbrasil.org.br/participants" : "https://data.directory.openbankingbrasil.org.br/participants";
    const res = await fetch(directoryParticipantsUrl);
    const participants = await res.json();

    return participants;
}

//create async function to start the job
const start = async function() {
    let results = {
        'total': 0
    };
    const mtlsHosts = await getMtlsEndpointsFromDirectory("production");
    for (const host of mtlsHosts) {
        try {
            const cert = await getCertificate(host);
            if (results[cert.toLegacyObject().issuer.CN]) {
                results[cert.toLegacyObject().issuer.CN]++;
                results['total']++;
            } else {
                results[cert.toLegacyObject().issuer.CN] = 1;
                results['total']++;
            }
            
            console.log(`Certificado do host ${host} obtido com sucesso.`);
            console.log(cert.toLegacyObject().issuer.CN);
            //break;
        } catch (e) {
            console.error(`Erro ao obter certificado do host ${host}: `, e);
        }
    }
    return results;
}

const results = await start();
console.log(results);