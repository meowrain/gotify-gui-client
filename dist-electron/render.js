async function setData(key, value) {
  try {
    await ipcRenderer.invoke("set-data", key, value);
    console.log("Data saved");
  } catch (error) {
    console.error("Error saving data", error);
  }
}
async function getData(key) {
  try {
    const value = await ipcRenderer.invoke("get-data", key);
    console.log("Data retrieved:", value);
    return value;
  } catch (error) {
    console.error("Error retrieving data", error);
  }
}
