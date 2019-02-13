const spreadsheetId = '1BXKZViBuh6g7m45W-gQuDSFSUj-8I5kGn-60WuwdTnM'

const loadGapi = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: 'AIzaSyDjw_0Cm--EFUyD_pHfoNQbkJ4H5vjbXBQ', client_id: '837997324881-lphqo6ae3n1g6bq8nfin5u9l02l0o8ef.apps.googleusercontent.com', discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest'], scope: 'https://www.googleapis.com/auth/spreadsheets'}).then(() => {
        resolve()
      })
    })
  })
}

const getRange = (worksheet, range) => {
  return new Promise((resolve, reject) => {
    loadGapi().then(() => {
      gapi.client.sheets.spreadsheets.values.get({spreadsheetId, range: `${worksheet}!${range}`}).then(response => {
        resolve(response.result.values)
      })
    })
  })
}

export const getGamesList = () => {
  return new Promise((resolve, reject) => {
    getRange('log', 'A2:A').then(sheetsResponse => {
      const gamesArray = sheetsResponse.map(element => element[0])
      resolve({data: gamesArray})
    })
  })
}

export const getRentedGamesList = () => {
  return new Promise((resolve, reject) => {
    getRange('log', 'A2:D').then(sheetsResponse => {
      const gamesArray = sheetsResponse.filter(element => element[3]).map(element => {
        const rentInfo = element[3].split(' ')
        return {game: element[0], client_id: rentInfo[0], date: `${rentInfo[1]} ${rentInfo[2]}`}
      })
      resolve({data: gamesArray})
    })
  })
}

export const getAvaliableGamesList = () => {
  return new Promise((resolve, reject) => {
    getRange('log', 'A2:E').then(sheetsResponse => {
      const gamesArray = sheetsResponse.filter(element => element[1] && !element[3] && !element[4]).map(element => element[0])
      resolve({data: gamesArray})
    })
  })
}

export const getClientInfoById = (id) => {
  return new Promise((resolve, reject) => {
    getRange('registers', 'A2:G').then(sheetsResponse => {
      const clientArray = sheetsResponse.find(array => array[0] === id)
      const clientObject = {
        name: clientArray[0],
        address: clientArray[1],
        tel: clientArray[2],
        cel: clientArray[3],
        email: clientArray[4],
        social: clientArray[5]
      }
      resolve({data: clientObject})
    })
  })
}
