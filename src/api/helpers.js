const gapiSettings = {
  apiKey: window.localStorage.getItem("apiKey"),
  client_id: window.localStorage.getItem("clientId"),
  scope: "https://www.googleapis.com/auth/spreadsheets",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
};

export const loadGapi = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client.init(gapiSettings).then(() => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          resolve();
        } else {
          gapi.auth2
            .getAuthInstance()
            .signIn()
            .then(response => {
              resolve();
            });
        }
      });
    });
  });
};

export const getRange = (worksheet, range, dimension) => {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: window.localStorage.getItem("spreadsheetId"),
        range: `${worksheet}!${range}`,
        majorDimension: dimension
      })
      .then(response => {
        resolve(response.result.values);
      });
  }).catch(error => {
    // Temporary solution
    return new Promise(function(resolve, reject) {
      window.setTimeout(() => {
        console.warn("GAPI connection has failed, retrying");
        getRange(worksheet, range, dimension).then(response => {
          resolve(response);
        });
      }, 1000);
    });
  });
};

export const bulkUpdate = bulkData => {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values
      .batchUpdate({
        spreadsheetId: window.localStorage.getItem("spreadsheetId"),
        resource: {
          data: bulkData,
          valueInputOption: "RAW"
        }
      })
      .then(response => {
        resolve(response.totalUpdatedCells);
      })
      .catch(e => {
        errorHandler(reject, e);
      });
  });
};

export const appendRow = (worksheet, data, dimension) => {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: window.localStorage.getItem("spreadsheetId"),
        range: worksheet,
        valueInputOption: "RAW",
        resource: {
          values: [data],
          majorDimension: dimension
        }
      })
      .then(response => {
        resolve(response.result.updates.updatedRows);
      })
      .catch(e => {
        errorHandler(reject, e);
      });
  });
};

const errorHandler = (reject, error) => {
  if (error.result.error.code === 401) {
    reject({
      ...error,
      message: "Não autorizado, por favor chame alguém do staff"
    });
  } else {
    reject(error);
  }
};
