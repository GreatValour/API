// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Function to fetch IP information from ipinfo.io
async function getIPInfo(ip) {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return null;
  }
}

// Function to read the file containing blocked ASNs
async function getBlockedASNs() {
  try {
    const blockedASNs = await readFileLines('blocked_asns.txt');
    return blockedASNs;
  } catch (error) {
    console.error('Error reading blocked ASNs file:', error);
    return [];
  }
}

// Function to read the file containing blocked IPs
async function getBlockedIPs() {
  try {
    const blockedIPs = await readFileLines('blocked_ips.txt');
    return blockedIPs;
  } catch (error) {
    console.error('Error reading blocked IPs file:', error);
    return [];
  }
}

// Middleware to check ASN and IP, and take action
app.use(async (req, res, next) => {
  const clientIP = req.ip; // Express automatically extracts the IP from the request

  try {
    const [ipInfo, blockedASNs, blockedIPs] = await Promise.all([
      getIPInfo(clientIP),
      getBlockedASNs(),
      getBlockedIPs(),
    ]);

    if (ipInfo && (blockedASNs.includes(ipInfo.asn) || blockedIPs.includes(ipInfo.ip))) {
      // Redirect to a blocked page or send an error response
      res.redirect(301, '/error404.html');
    } else {
      // Proceed to the next middleware and serve the static files
      next();
    }
  } catch (err) {
    console.error('Error checking IP and ASN:', err);
    // Proceed to the next middleware even if there's an error
    next();
  }
});

// Serve your static files
app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helper function to read lines from a file
async function readFileLines(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data.split('\n').map(line => line.trim());
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}
