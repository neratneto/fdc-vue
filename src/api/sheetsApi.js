import Moment from 'moment'
import * as helpers from './helpers'

/* INTERNAL FUNCTIONS */

const insertHistory = ({action, game, client, date, extraData}) => {
  return new Promise(function(resolve, reject) {
    const historyLog = [action, game, client, date, extraData]
    helpers.appendRow('history', historyLog, 'ROWS').then(sheetsResponse => {
      if (sheetsResponse) {
        resolve({message: 'success'})
      }
    }).catch(e => {
      reject(e)
    })
  })
}

const insertDamage = (row) => {
  return new Promise(function(resolve, reject) {
    helpers.appendRow('damage', row, 'ROWS').then(sheetsResponse => {
      if (sheetsResponse) {
        resolve({message: 'success'})
      }
    }).catch(e => {
      reject(e)
    })
  })
}

const gamesReference = (games) => {
  return new Promise((resolve, reject) => {
    helpers.getRange('log', 'A2:D', 'ROWS').then(sheetsResponse => {
      const referencedGamesArray = sheetsResponse.map((element, index) => {
        return {
          game: element[0],
          row: element,
          rowIndex: index + 2
        }
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

// EXPORTED FUNCTIONS

export const checkPassword = password => password !== 'unicornio'

export const getGamesList = () => {
  return new Promise((resolve, reject) => {
    helpers.getRange('log', 'A2:A', 'COLUMNS').then(sheetsResponse => {
      const gamesArray = sheetsResponse[0]
      resolve({data: gamesArray})
    })
  })
}

export const getRentedGamesList = () => {
  return new Promise((resolve, reject) => {
    helpers.getRange('log', 'A2:D', 'ROWS').then(sheetsResponse => {
      const gamesArray = sheetsResponse.filter(element => element[2] && !element[3]).map(element => {
        const rentInfo = element[2].replace('(', '').replace(')', '').split(' ')
        return {game: element[0], client_id: rentInfo[0], date: `${rentInfo[1]} ${rentInfo[2]}`}
      })
      resolve({data: gamesArray})
    })
  })
}

export const getAvaliableGamesList = () => {
  return new Promise((resolve, reject) => {
    helpers.getRange('log', 'A2:E', 'ROWS').then(sheetsResponse => {
      const gamesArray = sheetsResponse.filter(element => element[1] && !element[2] && !element[3]).map(element => element[0])
      resolve({data: gamesArray})
    })
  })
}

export const findLateGamesList = (gamesArray) => {
  return new Promise(function(resolve, reject) {
    gamesReference(gamesArray).then(referencedGamesArray => {
      const lateGames = []

      for (let gameObject of referencedGamesArray) {
        let checkInDate = gameObject.row[2].split(' ')
        checkInDate.shift()
        checkInDate = checkInDate.join(' ')
        checkInDate = checkInDate.includes('(') ? Moment(checkInDate, '(DD/MM/YYYY HH:mm)') : Moment(checkInDate)
        const daysLate = Moment().diff(checkInDate, 'days') - 7

        if (daysLate > 0) {
          lateGames.push({game: gameObject.game, days: daysLate})
        }
      }

      resolve({data: lateGames})
    })
  })
}

export const getClientInfoById = (id) => {
  return new Promise((resolve, reject) => {
    if (id.length === 14) {
    helpers.getRange('registers', 'A2:F', 'ROWS').then(sheetsResponse => {
      const clientArray = sheetsResponse.find(array => array[0] === id)
      if (clientArray) {
        const clientObject = {
          name: clientArray[1],
          address: clientArray[2],
          cel: clientArray[3],
          email: clientArray[4],
          social: clientArray[5]
        }
        resolve({data: clientObject})
      } else {
        reject('CPF not found')
      }
    })
  } else { reject() }
  })
}

export const revision = (items) => {
  return new Promise((resolve, reject) => {
    const currentMoment = Moment()

    gamesReference(items.selectedGames).then(referencedGamesArray => {
      const bulkData = []
      for (let gameObject of referencedGamesArray) {
        bulkData.push({
          range: `log!B${gameObject.rowIndex}:D${gameObject.rowIndex}`,
          values: [
            [`${items.adminName} (${currentMoment.format('DD/MM/YYYY HH:mm')})`, '', '']
          ],
          majorDimension: 'ROWS'
        })
      }

      helpers.bulkUpdate(bulkData).then(() => {
        for (let currentGame of referencedGamesArray) {
          insertHistory({
            action: 'Conferência',
            game: currentGame.game,
            client: items.adminName,
            date: currentMoment,
            extraData: `Danos: ${items.damage
              ? items.damageDescription
              : 'Nenhum'}`
          })

          if (items.damage) {
            insertDamage([
              ...currentGame.row,
              items.damageDescription
            ])
          }
        }
        resolve({message: 'success'})
      }).catch(e => {
        reject(e)
      })
    })
  })
}

export const checkOut = (items) => {
  return new Promise((resolve, reject) => {
    const currentMoment = Moment()

    gamesReference(items.selectedGames).then(referencedGamesArray => {
      const bulkData = []
      for (let gameObject of referencedGamesArray) {
        bulkData.push({
          range: `log!D${gameObject.rowIndex}`,
          values: [
            [`${items.cpf} (${currentMoment.format('DD/MM/YYYY HH:mm')})`]
          ],
          majorDimension: 'ROWS'
        })
      }

      helpers.bulkUpdate(bulkData).then(() => {
        for (let currentGame of referencedGamesArray) {
          const foundLateGame = items.lateGames.find(object => object.game && object.game === currentGame)
          insertHistory({
            action: 'Devolução',
            game: currentGame.game,
            client: items.cpf,
            date: currentMoment,
            extraData: foundLateGame
              ? `Atrasado: ${foundLateGame.days}`
              : 'Pontual'
          })
        }
        resolve({message: 'success'})
      }).catch(e => {
        reject(e)
      })
    })
  })
}

export const checkIn = (items) => {
  return new Promise((resolve, reject) => {
    const currentMoment = Moment()

    gamesReference(items.selectedGames).then(referencedGamesArray => {
      const bulkData = []
      for (let gameObject of referencedGamesArray) {
        bulkData.push({
          range: `log!C${gameObject.rowIndex}:E${gameObject.rowIndex}`,
          values: [
            [`${items.cpf} (${currentMoment.format('DD/MM/YYYY HH:mm')})`, '']
          ],
          majorDimension: 'ROWS'
        })
      }

      helpers.bulkUpdate(bulkData).then(() => {
        for (let currentGame of referencedGamesArray) {
          const gamePrice = currentGame.row[4] || 'não especificado'
          insertHistory({action: 'Locação', game: currentGame.game, client: items.cpf, date: currentMoment, extraData: `Preço: ${gamePrice}`})
        }
        resolve({message: 'success'})
      }).catch(e => {
        reject(e)
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
      clientObject.cel,
      clientObject.email,
      clientObject.social,
      clientObject.agreement,
      clientObject.indication
    ]
    helpers.appendRow('registers', clientRow, 'ROWS').then(sheetsResponse => {
      if (sheetsResponse) {
        resolve({message: 'success'})
      }
    }).catch(e => {
      reject(e)
    })
  })
}

export const adminCheck = (adminId) => {
  return new Promise((resolve, reject) => {
    helpers.getRange('admins', 'A2:B', 'ROWS').then(sheetsResponse => {
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
