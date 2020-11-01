import axios from 'axios'
 
const secrets = {
  a: window.localStorage.getItem("apiKey") || 'apikeyshouldbehere',
  b: window.localStorage.getItem("clientId") || 'clientidshouldbehere'
}
const HLApi = {
    apiKey: `d${secrets.b[11]}6d${secrets.b[1]}b5c-${secrets.b[11]}${secrets.b[3]}55-4fd5-${secrets.b[4]}ef${secrets.b[1]}-ffdc${secrets.b[11]}e${secrets.b[11]}${secrets.b[6]}${secrets.b[6]}${secrets.b[0]}f${secrets.b[2]}`,
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
        timezone: 'America/Sao_Paulo'
      }
      if (contact.address) contactBody.address = contact.address
      if (contact.indication) contactBody.source = contact.indication

      let config = {
        headers: {
          authorization: `Bearer ${HLApi.apiKey}`
        }
      }

      const hlResponse = await axios.post(`${HLApi.zapierUrl}/contact/add_update`, contactBody, config)
      console.log(hlResponse, contactBody)
      return hlResponse
    } catch (err) {
      console.error(err)
      return err
    }
  };
