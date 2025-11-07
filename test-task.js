const axios = require('axios');

/**
 * Test-Script zum Senden eines Tasks an den headless-task-server
 * Der Server muss mit SHOW_CHROME=true gestartet werden, um den Browser anzuzeigen
 */

const SERVER_URL = 'http://localhost:8080';
const AUTH_KEY = null; // Falls ein AUTH_KEY gesetzt ist, hier eintragen

async function sendTask() {
    try {
        console.log('Sende Task an den Server...');
        
        // Konfiguriere Headers
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Füge Auth-Header hinzu, falls AUTH_KEY gesetzt ist
        if (AUTH_KEY) {
            headers['Authorization'] = AUTH_KEY;
        }
        
        // Task-Daten: Einfaches Script, das eine Webseite besucht und den Titel zurückgibt
        const taskData = {
            script: `
                await agent.goto('https://maps.app.goo.gl/jPyzELtF6cazM9jX9');await agent.waitForPaintingStable();await agent.waitForMillis(5000);const cookieButton1=agent.activeTab.querySelector('button[aria-label="Alle akzeptieren"]');const cookieButton2=agent.activeTab.querySelector("button[aria-label='Alle akzeptieren']");const cookieButton3=agent.activeTab.querySelector('button[aria-label="Accept all"]');const cookieButton4=agent.activeTab.querySelector("button[aria-label='Accept all']");const cookieButton5=agent.activeTab.querySelector('[aria-label*="akzeptieren" i]');const cookieButton6=agent.activeTab.querySelector('[aria-label*="accept" i]');if(cookieButton1!==null&&await cookieButton1.$exists){await cookieButton1.$click();}else if(cookieButton2!==null&&await cookieButton2.$exists){await cookieButton2.$click();}else if(cookieButton3!==null&&await cookieButton3.$exists){await cookieButton3.$click();}else if(cookieButton4!==null&&await cookieButton4.$exists){await cookieButton4.$click();}else if(cookieButton5!==null&&await cookieButton5.$exists){await cookieButton5.$click();}else if(cookieButton6!==null&&await cookieButton6.$exists){await cookieButton6.$click();}await agent.waitForMillis(3000);await agent.waitForPaintingStable();const mapElement=agent.activeTab.querySelector('#scene');if(mapElement!==null&&await mapElement.$exists){await mapElement.$waitForExists({timeoutMs:30000});}const contentContainer=agent.activeTab.querySelector('#content-container');if(contentContainer!==null&&await contentContainer.$exists){await contentContainer.$waitForExists({timeoutMs:30000});}await agent.activeTab.waitForLoad('AllContentLoaded');await agent.waitForMillis(15000);const { document } = agent.activeTab;const element = document.querySelector('body');resolve((await element.innerHTML));
            `,
            options: {
                // Weitere Optionen können hier hinzugefügt werden
                // z.B. upstreamProxyUrl: 'http://proxy:port'
            }
        };
        
        console.log('Task-Daten:', JSON.stringify(taskData, null, 2));
        
        // Sende POST-Request
        const response = await axios.post(`${SERVER_URL}/task`, taskData, { headers });
        
        console.log('\n✅ Task erfolgreich ausgeführt!');
        console.log('\nAntwort vom Server:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data.status === 'RESOLVE') {
            console.log('\n📄 Ergebnis:', response.data.output);
        } else if (response.data.error) {
            console.log('\n❌ Fehler:', response.data.error);
        }
        
    } catch (error) {
        if (error.response) {
            // Server hat mit Fehlercode geantwortet
            console.error('❌ Server-Fehler:', error.response.status);
            console.error('Fehler-Details:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // Request wurde gesendet, aber keine Antwort erhalten
            console.error('❌ Keine Antwort vom Server. Ist der Server gestartet?');
            console.error('URL:', error.config?.url);
        } else {
            // Fehler beim Setup des Requests
            console.error('❌ Fehler:', error.message);
        }
        process.exit(1);
    }
}

// Führe das Script aus
sendTask();

