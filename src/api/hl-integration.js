import axios from 'axios'
 
const secrets = {
  a: window.localStorage.getItem("apiKey"),
  b: window.localStorage.getItem("clientId")
}
const HLApi = {
    apiKey: `d${b[11]}6d${b[1]}b5c-${b[11]}${b[3]}55-${b[9]}fd5-${b[4]}ef${b[1]}-ffdc${b[11]}e${b[11]}${b[6]}${b[6]}${b[0]}f${b[2]}`,
    contactsUrl: 'https://rest.gohighlevel.com/v1/contacts',
    zapierUrl: 'https://msgsndr.com/zapier'
  };
  
  export const fireTrigger = async (contact, triggerTag) => {
    // triggerTag: ['fdc-checkin' | 'fdc-checkout' | 'fdc-register']
    try {
      let contactBody = {
        tags: ['fdc-curitiba', triggerTag],
        email: contact.email,
        name: contact.name,
        phone: contact.phone || contact.cel,
        source: 'interface fdc',
        timezone: 'America/Sao_Paulo'
      }

      let config = {
        headers: {
          authorization: `Bearer ${HLApi.apiKey}`
        }
      }

      const hlResponse = await axios.post(`${HLApi.zapierUrl}/contact/add_update`, contactBody, config)
      return hlResponse
    } catch (err) {
      console.error(err)
      return err
    }
  };
