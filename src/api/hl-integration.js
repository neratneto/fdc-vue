import axios from 'axios'
 
const HLApi = {
    apiKey: window.localStorage.getItem("hlApiKey"),
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
