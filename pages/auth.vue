<template>
  <v-container
    fluid
    class="auth-container d-flex align-center justify-center"
  >
    <v-card
      class="auth-card"
      elevation="12"
      max-width="400"
      width="90%"
      rounded="xl"
    >
      <v-card-title
        class="text-center text-h5 font-weight-bold mb-4"
      >
        JobBoard
      </v-card-title>

      <v-tabs
        v-model="tab"
        background-color="transparent"
        grow
        color="primary"
        class="mb-2"
      >
        <v-tab value="login">Login</v-tab>
        <v-tab value="register">Cadastro</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="mt-2">
        <v-window-item value="login">
          <v-form @submit.prevent="handleLogin" class="form">
            <div class="form-section">
              <v-text-field
                v-model="login.email"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="primary"
                hide-details
              />
              <v-text-field
                v-model="login.password"
                label="Senha"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                color="primary"
                hide-details
              />
              <v-btn
                type="submit"
                color="primary"
                class="mt-5"
                block
                rounded="lg"
                :loading="loading"
                :disabled="loading"
              >
                Entrar
              </v-btn>
            </div>
          </v-form>
        </v-window-item>

        <v-window-item value="register">
          <v-form @submit.prevent="handleRegister" class="form">
            <div class="form-section">
              <v-text-field
                v-model="register.name"
                label="Nome"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                hide-details
              />
              <v-text-field
                v-model="register.email"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="primary"
                hide-details
              />
              <v-text-field
                v-model="register.password"
                label="Senha"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                color="primary"
                hide-details
              />
              <v-select
                v-model="register.role"
                :items="roles"
                label="Você é..."
                prepend-inner-icon="mdi-account-group"
                item-title="title"
                item-value="value"
                variant="outlined"
                color="primary"
                hide-details
                placeholder="Qual o seu perfil?"
              />
              <v-btn
                type="submit"
                color="primary"
                class="mt-5"
                block
                rounded="lg"
                :loading="loading"
                :disabled="loading"
              >
                Cadastrar
              </v-btn>
            </div>
          </v-form>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const tab = ref('login')
const loading = ref(false)

const login = ref({ email: '', password: '' })
const register = ref({ name: '', email: '', password: '', role: '' })

const roles = [
  { title: 'Recrutador', value: 'RECRUITER' },
  { title: 'Buscando emprego', value: 'CANDIDATE' },
]

const { $toast } = useNuxtApp()

async function handleLogin() {
  if (!login.value.email || !login.value.password) {
    $toast.warn('Preencha todos os campos.')
    return
  }

  loading.value = true
  try {
    await auth.login(login.value.email, login.value.password)
    $toast.success('Login realizado com sucesso!')
    router.push('/feed')
  } catch (err) {
    $toast.error('Email ou senha inválidos.')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!register.value.role) {
    $toast.warn('Selecione um tipo de conta.')
    return
  }

  loading.value = true
  try {
    await auth.register(
      register.value.name,
      register.value.email,
      register.value.password,
      register.value.role
    )
    $toast.success('Cadastro realizado! Faça login para continuar.')
    tab.value = 'login'
  } catch (err) {
    $toast.error('Erro ao cadastrar. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1b1b 0%, #2b2b2b 100%);
  padding: 1rem;
}

.auth-card {
  background-color: #1e1e1e;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  transition: box-shadow 0.3s ease;
}

.auth-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.v-tab {
  text-transform: none;
  font-weight: 500;
}

.form-section {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 600px) {
  .auth-card {
    width: 100%;
    padding: 1.5rem;
  }

  .v-card-title {
    font-size: 1.25rem;
  }
}
</style>
