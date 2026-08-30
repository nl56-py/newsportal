/**
 * Production Server Entrypoint for DirectAdmin / CloudLinux / Phusion Passenger
 * 
 * Phusion Passenger dynamically injects process.env.PORT (either a high port or unix socket).
 * This entrypoint configures the environment and starts the Next.js standalone server.
 */

const path = require("path");
const fs = require("fs");

// Configure environment for DirectAdmin & Passenger
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || 3000;

const standaloneServerPath = path.join(__dirname, ".next", "standalone", "server.js");

if (fs.existsSync(standaloneServerPath)) {
  console.log(`[DirectAdmin Passenger] Launching Next.js standalone server on PORT: ${process.env.PORT}`);
  require(standaloneServerPath);
} else {
  // Fallback if standalone build hasn't run yet or when running in local dev/non-standalone mode
  console.warn(
    `[DirectAdmin Passenger] Warning: .next/standalone/server.js not found at ${standaloneServerPath}.`
  );
  console.warn("Please run 'npm run build' or 'npm run build:da' first.");

  const http = require("http");
  const server = http.createServer((req, res) => {
    res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>503 - Application Initializing</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>सफ्टवेयर सेटअप भइरहेको छ...</h2>
          <p>The application is being built or deployed. Please ensure you ran <code>npm run build:da</code>.</p>
        </body>
      </html>
    `);
  });

  server.listen(process.env.PORT, () => {
    console.log(`Fallback server listening on port ${process.env.PORT}`);
  });
}
