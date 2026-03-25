const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Detect if running in a VS Code Dev Tunnel
    if (hostname.includes('devtunnels.ms') || hostname.includes('github.dev')) {
        console.log('Detected Dev Tunnel Environment');

        // Attempt to replace the frontend port (3000) with the backend port (5000)
        // VS Code URLs often look like: https://<id>-3000.<region>.devtunnels.ms
        if (hostname.includes('-3000')) {
            const backendHostname = hostname.replace('-3000', '-5000');
            console.log('Targeting Internal Backend:', backendHostname);
            return `${protocol}//${backendHostname}`;
        }

        // Fallback: If the simple replace didn't work or naming is different, 
        // try replacing the first occurrence of 3000 if it exists
        if (hostname.includes('3000')) {
            const backendHostname = hostname.replace('3000', '5000');
            return `${protocol}//${backendHostname}`;
        }
    }

    // Production domain configuration
    if (hostname === 'sag.chiapas.gob.mx') {
        return `${protocol}//${hostname}:3026`;
    }

    // Default to dynamic hostname (works for localhost, 127.0.0.1, and LAN IPs)
    return `${protocol}//${hostname}:5000`;
};

export const API_BASE_URL = getApiBaseUrl();
