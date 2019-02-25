import Moment from 'moment'
import Snackbar from '@/plugins/snackbar/snackbar.js'

const gapiSettings = {
  apiKey: window.localStorage.getItem('apiKey'),
  client_id: window.localStorage.getItem('clientId'),
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
}
/* SHEETS API HANDLERS */

export const loadGapi = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init(gapiSettings).then(() => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          resolve()
        } else {
          gapi.auth2.getAuthInstance().signIn().then(response => {
            resolve()
          })
        }
      })
    })
  })
}

const getRange = (worksheet, range, dimension) => {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values.get({spreadsheetId: window.localStorage.getItem('spreadsheetId'), range: `${worksheet}!${range}`, majorDimension: dimension}).then(response => {
      resolve(response.result.values)
    })
  }).catch(error => {
    // Temporary solution
    return new Promise(function(resolve, reject) {
      window.setTimeout(() => {
        console.warn('GAPI connection has failed, retrying')
        getRange(worksheet, range, dimension).then(response => {
          resolve(response)
        })
      }, 1000)
    })
  })
}

const bulkUpdate = (bulkData) => {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: window.localStorage.getItem('spreadsheetId'),
      resource: {
        data: bulkData,
        valueInputOption: 'RAW'
      }
    }).then(response => {
      resolve(response.totalUpdatedCells)
    })
  })
}

const appendRow = (worksheet, data, dimension) => {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: window.localStorage.getItem('spreadsheetId'),
      range: worksheet,
      valueInputOption: 'RAW',
      resource: {
        values: [data],
        majorDimension: dimension
      }
    }).then(response => {
      resolve(response.result.updates.updatedRows)
    })
  })
}

/* INTERNAL FUNCTIONS */

const gamesReference = (games) => {
  return new Promise((resolve, reject) => {
    getRange('log', 'A2:E', 'ROWS').then(sheetsResponse => {
      const referencedGamesArray = sheetsResponse.map((element, index) => {
        return {game: element[0], row: element, rowIndex: index + 2}
      })
      const recievedGamesReference = []
      for (let game of games) {
        const foundGame = referencedGamesArray.find(object => object.game === game)
        if (foundGame) {
          recievedGamesReference.push(foundGame)
        }
      }
      resolve(recievedGamesReference)
    })
  })
}

export const getGamesList = () => {
  return new Promise((resolve, reject) => {
    getRange('log', 'A2:A', 'COLUMNS').then(sheetsResponse => {
      const gamesArray = sheetsResponse[0]
      resolve({data: gamesArray})
    })
  })
}

export const getRentedGamesList = () => {
  return new Promise((resolve, reject) => {
    getRange('log', 'A2:D', 'ROWS').then(sheetsResponse => {
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
    getRange('log', 'A2:E', 'ROWS').then(sheetsResponse => {
      const gamesArray = sheetsResponse.filter(element => element[1] && !element[3] && !element[4]).map(element => element[0])
      resolve({data: gamesArray})
    })
  })
}

export const getClientInfoById = (id) => {
  return new Promise((resolve, reject) => {
    getRange('registers', 'A2:G', 'ROWS').then(sheetsResponse => {
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

export const checkPassword = password => password !== 'unicornio'

export const revision = (items) => {
  return new Promise((resolve, reject) => {
    const currentMoment = Moment()

    gamesReference(items.selectedGames).then(referencedGamesArray => {
      const bulkData = []
      for (let gameObject of referencedGamesArray) {
        bulkData.push({
          range: `log!B${gameObject.rowIndex}:E${gameObject.rowIndex}`,
          values: [
            [`${items.adminName} (${currentMoment.format('DD/MM/YYYY HH:mm')})`, '', '', '']
          ],
          majorDimension: 'ROWS'
        })
      }

      bulkUpdate(bulkData).then(amount => {
        for (let currentGame of referencedGamesArray) {
          insertHistory({action: 'Conferência', game: currentGame.game, client: items.adminName, date: currentMoment, extraData: `Danos: ${items.damage ? items.damageDescription : 'Nenhum'}`})

          if (items.damage) {
            insertDamage([...currentGame.row, items.damageDescription])
          }
        }
        resolve({ message: 'success', amount })
      })
    })
  })
}

export const createClient = (clientObject) => {
  return new Promise((resolve, reject) => {
    const clientRow = [
      clientObject.cpf,
      clientObject.name,
      clientObject.address,
      clientObject.tel,
      clientObject.cel,
      clientObject.email,
      clientObject.social,
      clientObject.agreement,
      clientObject.indication
    ]
    appendRow('registers', clientRow, 'ROWS').then(sheetsResponse => {
      if (sheetsResponse) {
        resolve({message: 'success'})
      }
    })
  })
}

export const adminCheck = (adminId) => {
  return new Promise((resolve, reject) => {
    getRange('admins', 'A2:B', 'ROWS').then(sheetsResponse => {
      for (let admin of sheetsResponse) {
        if (admin[0] === adminId) {
          resolve({
            data: {
              id: admin[0],
              name: admin[1],
              message: 'success'
            }
          })
        }
      }
      resolve({
        data: {
          message: 'not found'
        }
      })
    })
  })
}

const insertHistory = ({action, game, client, date, extraData}) => {
  return new Promise(function(resolve, reject) {
    const historyLog = [action, game, client, date, extraData]
    appendRow('history', historyLog, 'ROWS').then(sheetsResponse => {
      if (sheetsResponse) {
        resolve({message: 'success'})
      }
    })
  })
}

const insertDamage = (row) => {
  return new Promise(function(resolve, reject) {
    appendRow('damage', row, 'ROWS').then(sheetsResponse => {
      if (sheetsResponse) {
        resolve({message: 'success'})
      }
    })
  })
}
