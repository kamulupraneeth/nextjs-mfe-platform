// Listens to incoming data messages shipped from the main React UI thread
self.onmessage = function (e) {
  const { logs, searchTerm } = e.data;

  // If there is no active search query, return the base array immediately
  if (!searchTerm || searchTerm.trim() === "") {
    self.postMessage(logs);
    return;
  }

  const cleanTerm = searchTerm.toLowerCase().trim();

  // Run the computation safely on the isolated background thread
  const filteredLogs = logs.filter((log) => {
    return (
      log.id.toLowerCase().includes(cleanTerm) ||
      log.statusCode.toString().includes(cleanTerm) ||
      log.cpuUsage.toString().includes(cleanTerm)
    );
  });

  // Post the processed result array back up to the main component layer
  self.postMessage(filteredLogs);
};
