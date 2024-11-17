const http = require("http");

// JSON data to be returned
const responseData = {
  id: "133763117410000000",
  cat: "1",
  title: "ירי רקטות וטילים",
  data: ["מרגליות"],
  desc: "היכנסו למרחב המוגן ושהו בו 10 דקות",
};

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response header to indicate JSON content
  res.writeHead(200, { "Content-Type": "application/json" });

  // Send the JSON response
  res.end(JSON.stringify(responseData));
});

// Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});