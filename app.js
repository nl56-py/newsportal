/**
 * Production Server Entrypoint for cPanel / DirectAdmin / CloudLinux / Phusion Passenger
 * 
 * Phusion Passenger dynamically injects process.env.PORT (either a high port or unix socket).
 * This entrypoint configures the environment and starts the Next.js standalone server.
 */

const path = require("path");
const fs = require("fs");

// Configure environment for cPanel & Passenger
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || 3000;

// Set default live MariaDB connection params if not in environment
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_USER = process.env.DB_USER || "sawalne1_db1";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "Damak123@#";
process.env.DB_NAME = process.env.DB_NAME || "sawalne1_db1";
process.env.DB_PORT = process.env.DB_PORT || "3306";
process.env.DB_PREFIX = process.env.DB_PREFIX || "YVbSX5aUsA_";

const serverPaths = [
  path.join(__dirname, "server.js"),
  path.join(__dirname, ".next", "standalone", "server.js"),
];

let targetServerPath = null;
for (const p of serverPaths) {
  if (fs.existsSync(p)) {
    targetServerPath = p;
    break;
  }
}

if (targetServerPath) {
  console.log(`[cPanel Passenger] Launching Next.js standalone server from ${targetServerPath} on PORT: ${process.env.PORT}`);
  require(targetServerPath);
} else {
  console.warn("[cPanel Passenger] Warning: Standalone server.js not found.");
  const http = require("http");
  const server = http.createServer((req, res) => {
    res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>503 - Application Initializing</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>सवाल नेपाल पोर्टल सुरु हुँदैछ...</h2>
          <p>Application is booting up on Node.js. Please refresh in a moment.</p>
        </body>
      </html>
    `);
  });

  server.listen(process.env.PORT, () => {
    console.log(`Fallback server listening on port ${process.env.PORT}`);
  });
}
