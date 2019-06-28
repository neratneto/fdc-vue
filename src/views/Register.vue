<template>
<v-container justify-center>
  <v-layout align-center justify-center column fill-height>
    <p class="page-title"> Registro de novo usuário!</p>

    <v-card class="pa-2" width="320px">
      <v-card-text>
        <v-layout align-start fill-height column>
          <v-text-field label="CPF" v-model="formData.cpf" clearable name="cpf" solo mask="###.###.###-##" @input="validateId" return-masked-value required :error="$v.formData.cpf.$invalid" />
          <v-text-field label="Nome completo" v-model="formData.name" solo clearable required />
          <v-text-field label="Endereço" v-model="formData.address" solo clearable required />
          <v-text-field label="Email" v-model="formData.email" solo clearable :error="$v.formData.email.$invalid" />
          <v-text-field label="Celular" v-model="formData.cel" mask="(##) # ####-####" solo clearable :error="$v.formData.cel.$invalid" />
          <v-text-field label="Rede social" v-model="formData.social" solo clearable />
          <v-select label="O que te trouxe até a loja?" @input="setIndication" :items="indicationOptions" solo clearable />
          <v-text-field label="Senha do administrador" clearable name="admin-password" v-model="adminPassword" solo :append-icon="visibility ? 'visibility' : 'visibility_off'" @click:append="() => (visibility = !visibility)" :type="visibility ? 'password' : 'text'"
            required :error="passwordError" />
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn :color="acceptedTerms ? 'secondary' : 'error'" :disabled="$v.$invalid" :loading="submitLoader" @click="submit">Enviar!</v-btn>
        <v-spacer />
        <termos :terms.sync="acceptedTerms" />
      </v-card-actions>
    </v-card>
  </v-layout>
</v-container>
</template>

<script>
import Termos from '@/components/Termos.vue'
import { mapActions } from 'vuex'
import { checkPassword } from '@/api/sheetsApi.js'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  components: {
    Termos
  },
  data: () => ({
    visibility: true,
    formData: {
      cpf: null,
      name: null,
      address: null,
      cel: null,
      email: null,
      social: null,
      indication: null
    },
    acceptedTerms: false,
    adminPassword: '',
    submitLoader: false,
    indicationOptions: ['Facebook', 'Instagram', 'Amigos', 'Família', 'Pa-Kua', 'Eventos', 'Outros']
  }),
  validations: {
    formData: {
      cpf: {
        required,
        minLength: minLength(14)
      },
      name: {
        required
      },
      address: {
        required
      },
      cel: {
        required,
        minLength: minLength(10)
      },
      email: {
        required,
        email
      },
      indication: {
        required
      }
    },
    adminPassword: {
      required
    }
  },
  computed: {
    passwordError() {
      const valid = checkPassword(this.adminPassword)
      this.$emit('update:passwordValid', valid)
      return valid
    }
  },
  methods: {
    ...mapActions(['registerClient', 'getClientInfo']),
    submit() {
      this.submitLoader = true
      if (this.acceptedTerms) {
        const client = {
          ...this.formData,
          agreement: `Concordou com o contrato vigente em ${this.$moment()}`
        }
        this.registerClient({ adminPassword: this.adminPassword, client }).then(() => {
          this.submitLoader = false
          this.sendEmail()
          this.$confirm({ message: 'Cliente cadastrado com sucesso!', confirmColor: 'success', confirmText: 'Menu incial', cancelColor: 'primary', cancelText: 'Cadastrar outro cliente' }).then(() => {
            this.$router.push('/')
          }).catch(() => {
            this.formData = {
              cpf: null,
              name: null,
              address: null,
              cel: null,
              email: null,
              social: null,
              indication: null
            }
            this.acceptedTerms = false
            this.adminPassword = ''
            this.submitLoader = false
          })
        }).catch(error => {
          this.submitLoader = false
          this.$confirm({ message: `Erro ao realizar o cadastro. Informações sobre o erro: ${error}`, confirmColor: 'success', confirmText: 'Menu incial', cancelColor: 'error', cancelText: 'Tentar novamente' }).then(() => {
            this.$router.push('/')
          })
        })
      } else {
        this.submitLoader = false
        this.$snackbar({ message: 'Você deve concordar com os termos de locação', snackbarColor: 'error' })
      }
    },
    setIndication(value) { this.formData.indication = value },
    validateId() {
      this.getClientInfo(this.formData.cpf).then(client => {
        this.$confirm({ message: 'CPF já cadastrado, deseja realizar outro cadastro?' }).then(() => {
          this.formData.cpf = null
        }).catch(() => {
          this.$router.push('/')
        })
      }).catch(() => {})
    },
    sendEmail() {
      const template_params = {
        'to_email': this.formData.email,
        'to_name': this.formData.name,
        'confirmed_date': this.$moment().format('HH:mm DD/MM/YYYY')
      }

      const service_id = 'default_service'
      const template_id = window.localStorage.getItem("emailTemplateId")
      const user_id = window.localStorage.getItem("emailUserId")
      emailjs.send(service_id, template_id, template_params, user_id)
    }
  },
  mounted() {
    this.formData.cpf = this.$route.params.cpf
  }
}
</script>
