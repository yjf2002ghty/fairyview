const fs = require("fs");
const express = require("express");
const app = express();
const os = require("os");
const PathSplitterMatcher = new RegExp("/", "g");
const JSONSplitterMatcher = new RegExp("(?<=\\:|\\;|\\,)", "g");
const OutputDirectory = "/public";

let port = 3000;

console.log("============================================");
console.log("             SECURITY WARNING");
console.log("============================================");
console.log(
  "This backend does not check the input from the frontend. The client user can enter anything as the command, which can pose threat to your server security. Therefore you should only allow trusted users to connect.\n\n",
);

function GenerateErrorPage(
  status,
  message,
  description,
  method,
  protocol,
  host,
  url,
  query,
  headers,
  path,
  reasons,
  suggestion,
) {
  return `<!doctypehtml><html><head><style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border:0;font:inherit;font-family:Arial}html,body{height:100%}html{background-color:#eee}main{height:100%;display:flex;flex-direction:column;padding:20px;margin-bottom:20px}#pagetitle{font-size:40px;margin-bottom:10px;font-weight:bold;color:#dc143c;background-color:#aaa;border:5px#000 solid;width:100%;padding:10px}#errordescription{font-size:20px;margin-bottom:20px;font-weight:bold;color:#000}.main{border:3px#999 dotted;width:100%;padding:10px;margin-bottom:20px}h1{font-weight:bold;color:#000;font-size:20px;margin-bottom:10px}.content{padding-left:20px;margin-bottom:5px;word-wrap:break-word;white-space:pre-line}hr{border:1px#000 solid;margin-bottom:5px}#footer{padding:10px;text-align:center}</style><title>Error</title></head><body><main><p id="pagetitle">Error ${status} - ${message}</p><p id="errordescription">${description}</p><div class="main"><h1>Request Details</h1><p class="content">Request method: ${method}</p><p class="content">Request URL: ${protocol}://${host}${url}</p><p class="content">Query string: ${query}</p><p class="content">Request headers: ${headers}</p><p class="content">Physical path: ${path}</p></div><div class="main"><h1>Possible Reasons</h1><p class="content">${reasons}</p></div><div class="main"><h1>Suggestions</h1><p class="content">${suggestion}</p></div><div id="footer"><hr/><p>Node.js ${process.version}</p></div></main></body></html>`;
}

app.use(function (req, res, next) {
  if (req.method == "PUT" || req.method == "DELETE" || req.method == "PATCH") {
    res
      .status(405)
      .send(
        GenerateErrorPage(
          405,
          "Method Not Allowed",
          `Not allowed method: ${req.method}. This server does not allow you to change objects on the server.`,
          req.method,
          req.protocol,
          req.get("host"),
          req.originalUrl,
          JSON.stringify(req.query).replace(JSONSplitterMatcher, " "),
          JSON.stringify(req.headers).replace(JSONSplitterMatcher, " "),
          process.platform == "win32"
            ? `${process.cwd()}${req.path.replace(PathSplitterMatcher, "\\")}`
            : `${process.cwd()}${req.path}`,
          "No possible reasons available.",
          "No suggestions available.",
        ),
      );
  } else if (req.path == "" || req.path == "/") {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    next();
  } else {
    if (req.path.startsWith(OutputDirectory)) {
      fs.stat("." + req.path, (err, stats) => {
        if (err) {
          res
            .status(404)
            .send(
              GenerateErrorPage(
                404,
                "Not Found",
                "The object you requested is not found. It might have been moved, deleted or temporarily unavailable.",
                req.method,
                req.protocol,
                req.get("host"),
                req.originalUrl,
                JSON.stringify(req.query).replace(JSONSplitterMatcher, " "),
                JSON.stringify(req.headers).replace(JSONSplitterMatcher, " "),
                process.platform == "win32"
                  ? `${process.cwd()}${req.path.replace(PathSplitterMatcher, "\\")}`
                  : `${process.cwd()}${req.path}`,
                "1. The object you requested does not exist.\n2. Typo(s) in URL.\n3. Typo(s) in file or directory name on the server.",
                "Make sure that the URL and the object name on the server are correct. Create the object on the server if it does not exist.",
              ),
            );
        } else {
          if (stats.isFile()) {
            fs.open("." + req.path, "r", (err, fd) => {
              if (fd) {
                fs.closeSync(fd);
              }
              if (err) {
                res
                  .status(403)
                  .send(
                    GenerateErrorPage(
                      403,
                      "Forbidden",
                      "Due to the file system access control settings or encryption of the object you requested on the server, you do not have permission to read this object.",
                      req.method,
                      req.protocol,
                      req.get("host"),
                      req.originalUrl,
                      JSON.stringify(req.query).replace(
                        JSONSplitterMatcher,
                        " ",
                      ),
                      JSON.stringify(req.headers).replace(
                        JSONSplitterMatcher,
                        " ",
                      ),
                      process.platform == "win32"
                        ? `${process.cwd()}${req.path.replace(PathSplitterMatcher, "\\")}`
                        : `${process.cwd()}${req.path}`,
                      "1. The user running this server does not have permission to read this object.\n2. This object is encrypted and the user running this server cannot read it.",
                      "Check the file or directory access control settings of this object on the server and make sure that the user running this server can read it.",
                    ),
                  );
              } else {
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
                //res.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,post-check=0,pre-check=0");
                next();
              }
            });
          } else {
            res
              .status(400)
              .send(
                GenerateErrorPage(
                  400,
                  "Bad Request",
                  "The object you requested is not a file. This server only accepts file transfer.",
                  req.method,
                  req.protocol,
                  req.get("host"),
                  req.originalUrl,
                  JSON.stringify(req.query).replace(JSONSplitterMatcher, " "),
                  JSON.stringify(req.headers).replace(JSONSplitterMatcher, " "),
                  process.platform == "win32"
                    ? `${process.cwd()}${req.path.replace(PathSplitterMatcher, "\\")}`
                    : `${process.cwd()}${req.path}`,
                  "1. The object you requested is not a file.\n2. Typo(s) in URL.\n3. The name of the object has changed.",
                  "Make sure that the URL and the file name on the server are correct. Create the object on the server if it does not exist.",
                ),
              );
          }
        }
      });
    } else {
      res
        .status(400)
        .send(
          GenerateErrorPage(
            400,
            "Bad Request",
            "The object you requested is not in output directory.",
            req.method,
            req.protocol,
            req.get("host"),
            req.originalUrl,
            JSON.stringify(req.query).replace(JSONSplitterMatcher, " "),
            JSON.stringify(req.headers).replace(JSONSplitterMatcher, " "),
            process.platform == "win32"
              ? `${process.cwd()}${req.path.replace(PathSplitterMatcher, "\\")}`
              : `${process.cwd()}${req.path}`,
            `You are accessing an object out of output directory "${OutputDirectory}".`,
            "Re-enter your URL.",
          ),
        );
    }
  }
});

app.use(OutputDirectory, express.static(OutputDirectory.slice(1)));

app.all("/", function (req, res) {
  console.log("[HTTP Server] Redirect to index page.");
  res.redirect(`${OutputDirectory}/index.html`);
});

const httpserver = app.listen(port, function () {
  let host = httpserver.address().address;
  let port = httpserver.address().port;
  console.log("=======================================");
  console.log("          FairyView  Server");
  console.log("=======================================");
  console.log("This is the back end of FairyGround, acting as a server.");
  console.log(
    "To open FairyView UI, open your browser and go to the following URL:",
  );
  console.log(`http://localhost:${port}`);
  console.log("[HTTP Server] Server is up at http://localhost:%s", port);
});
