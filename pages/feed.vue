<template>
  <v-layout>
    <v-app-bar color="#101010" flat height="68" class="px-6">
      <v-toolbar-title class="text-h5 font-weight-bold text-white">
        Job<span class="text-primary">Board</span>
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
        rounded="lg"
        class="font-weight-medium mr-4"
        @click="openNewJob"
        v-if="userRole === 'RECRUITER'"
      >
        <span class="d-none d-sm-inline">Nova vaga</span>
      </v-btn>

      <div class="d-flex align-center gap-2 text-white">
        <v-icon>mdi-account</v-icon>
        <span class="font-weight-medium d-none d-sm-inline">{{ userName }}</span>
        <v-btn icon color="error" @click="logout" title="Sair" class="ml-2">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="feed-bg py-10">
      <v-container class="d-flex justify-center mb-8 px-4">
        <v-text-field
          v-model="search"
          variant="solo-filled"
          placeholder="Buscar vagas por título ou tecnologia..."
          prepend-inner-icon="mdi-magnify"
          color="primary"
          density="comfortable"
          class="search-input"
          hide-details
        />
      </v-container>

      <v-container class="px-4 d-flex flex-column align-center">
        <v-tabs v-model="tab" align-tabs="center" color="primary" class="mb-8" grow>
          <v-tab value="feed">Vagas disponíveis</v-tab>
          <v-tab value="myJobs">Minhas vagas</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="w-100">
          <v-window-item value="feed">
            <div class="jobs-list">
              <v-skeleton-loader
                v-if="loading"
                type="card, card, card"
                class="w-100"
                max-width="780"
              />

              <div
                v-else-if="!jobs.length"
                class="text-center text-medium-emphasis py-10"
              >
                <v-icon size="40" color="grey">mdi-briefcase-off</v-icon>
                <p class="mt-2">Nenhuma vaga encontrada.</p>
              </div>

              <template v-else>
                <v-card
                  v-for="job in jobs"
                  :key="job.id"
                  class="job-card pa-6"
                  max-width="780"
                  width="100%"
                  rounded="xl"
                  elevation="4"
                >
                  <div
                    class="d-flex flex-column flex-sm-row justify-space-between align-start mb-3"
                  >
                    <div>
                      <h3 class="text-h6 font-weight-bold">{{ job.title }}</h3>
                      <p class="text-body-2 text-medium-emphasis mt-1">
                        {{ translateTypeLocation(job.typeLocation) }}
                      </p>
                    </div>

                    <div class="d-flex gap-2 flex-wrap">
                      <template v-if="userRole !== 'RECRUITER'">
                        <v-chip
                          v-if="isApplied(job)"
                          color="success"
                          variant="flat"
                          class="font-weight-medium"
                          size="small"
                          prepend-icon="mdi-check"
                        >
                          Aplicado
                        </v-chip>

                        <v-btn
                          v-else
                          color="primary"
                          variant="flat"
                          rounded="lg"
                          size="small"
                          prepend-icon="mdi-send"
                          @click="apply(job)"
                          class="font-weight-medium w-100 w-sm-auto"
                        >
                          Aplicar
                        </v-btn>
                      </template>
                    </div>
                  </div>

                  <p class="text-body-2 text-medium-emphasis mb-4">{{ job.description }}</p>

                  <v-divider class="mb-3" />

                  <div
                    class="d-flex justify-space-between align-center text-caption text-medium-emphasis flex-wrap gap-2"
                  >
                    <div class="d-flex align-center gap-2">
                      <v-icon size="16">mdi-cash</v-icon>
                      <span>{{ formatCurrency(job.salary) }}</span>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <v-icon size="16">mdi-calendar</v-icon>
                      <span>Cadastrado: {{ formatDate(job.createdAt) }}</span>
                    </div>
                  </div>
                </v-card>
              </template>
            </div>
          </v-window-item>

          <v-window-item value="myJobs">
            <div class="jobs-list">
              <v-skeleton-loader
                v-if="loading"
                type="card, card, card"
                class="w-100"
                max-width="780"
              />

              <div
                v-else-if="!myJobs.length"
                class="text-center text-medium-emphasis py-10"
              >
                <v-icon size="40" color="grey">mdi-briefcase-off</v-icon>
                <p class="mt-2">
                  {{
                    userRole === 'RECRUITER'
                      ? 'Você ainda não publicou nenhuma vaga.'
                      : 'Você ainda não se candidatou a nenhuma vaga.'
                  }}
                </p>
              </div>

              <template v-else>
                <v-card
                  v-for="job in myJobs"
                  :key="job.id"
                  class="job-card pa-6"
                  max-width="780"
                  width="100%"
                  rounded="xl"
                  elevation="4"
                >
                  <div
                    class="d-flex flex-column flex-sm-row justify-space-between align-start mb-3"
                  >
                    <div>
                      <h3 class="text-h6 font-weight-bold">{{ job.title }}</h3>
                      <p class="text-body-2 text-medium-emphasis mt-1">
                        {{ translateTypeLocation(job.typeLocation) }}
                      </p>
                    </div>

                    <div class="d-flex gap-2 flex-wrap">
                      <template v-if="userRole === 'RECRUITER'">
                        <v-btn
                          size="small"
                          variant="tonal"
                          color="primary"
                          prepend-icon="mdi-pencil"
                          @click="editJob(job)"
                        >
                          Editar
                        </v-btn>
                        <v-btn
                          size="small"
                          variant="tonal"
                          color="error"
                          prepend-icon="mdi-delete"
                          @click="confirmDelete(job)"
                        >
                          Excluir
                        </v-btn>
                      </template>
                    </div>
                  </div>

                  <p class="text-body-2 text-medium-emphasis mb-4">{{ job.description }}</p>

                  <v-divider class="mb-3" />

                  <div
                    class="d-flex justify-space-between align-center text-caption text-medium-emphasis flex-wrap gap-2"
                  >
                    <div class="d-flex align-center gap-2">
                      <v-icon size="16">mdi-cash</v-icon>
                      <span>{{ formatCurrency(job.salary) }}</span>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <v-icon size="16">mdi-calendar</v-icon>
                      <span>Cadastrado: {{ formatDate(job.createdAt) }}</span>
                    </div>
                  </div>
                </v-card>
              </template>
            </div>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>

    <NewJobDialog
      v-model="dialog"
      :editData="editData"
      @add-job="addJob"
      @update-job="updateJob"
    />

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          Confirmar exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir a vaga
          <strong>{{ jobToDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="deleteJob">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useDebounceFn } from '@vueuse/core'
  import NewJobDialog from '@/components/NewJobDialog.vue'
  import { useAuthStore } from '@/stores/auth'

  const auth = useAuthStore()
  auth.load()
  const { $api, $toast } = useNuxtApp()

  const userName = computed(() => auth.user?.name)
  const userRole = computed(() => auth.user?.role)

  const search = ref('')
  const tab = ref('feed')
  const dialog = ref(false)
  const editData = ref(null)
  const loading = ref(false)

  const jobs = ref([])
  const myJobs = ref([])
  const myApplications = ref([])

  const deleteDialog = ref(false)
  const jobToDelete = ref(null)

  const debouncedSearch = useDebounceFn(loadJobs, 500)

  const loadJobs = async () => {
    loading.value = true
    try {
      const { data: jobsData } = await $api.get('/jobs', {
        params: { search: search.value || undefined },
      })
      jobs.value = jobsData

      if (userRole.value === 'RECRUITER') {
        myJobs.value = jobsData.filter(j => j.postedById === auth.user?.id)
      } else {
        const { data: apps } = await $api.get(`/applications/user/${auth.user?.id}`)
        myApplications.value = apps.map(a => a.jobId)
        myJobs.value = apps.map(a => a.job)
      }
    } catch {
      $toast.error('Erro ao carregar vagas.')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadJobs)
  watch(search, () => {
    debouncedSearch()
  })

  function translateTypeLocation(type) {
    const map = { REMOTE: 'Remoto', HYBRID: 'Híbrido', ONSITE: 'Presencial' }
    return map[type] || type
  }

  function isApplied(job) {
    return myApplications.value.includes(job.id)
  }

  async function apply(job) {
    try {
      await $api.post('/applications', { userId: auth.user?.id, jobId: job.id })
      myApplications.value.push(job.id)
      $toast.success(`Você aplicou para: ${job.title}`)
    } catch {
      $toast.error('Ocorreu um erro ao aplicar para a vaga.')
    }
  }

  function openNewJob() {
    editData.value = null
    dialog.value = true
  }

  async function addJob(newJob) {
    try {
      const { data } = await $api.post('/jobs', { ...newJob, postedById: auth.user?.id })
      jobs.value.unshift(data)
      myJobs.value.unshift(data)
      $toast.success('Vaga criada com sucesso!')
    } catch {
      $toast.error('Ocorreu um erro ao criar a vaga.')
    }
  }

  function editJob(job) {
    editData.value = { ...job }
    dialog.value = true
  }

  function confirmDelete(job) {
    jobToDelete.value = job
    deleteDialog.value = true
  }

  async function deleteJob() {
    try {
      await $api.delete(`/jobs/${jobToDelete.value.id}`)
      jobs.value = jobs.value.filter(j => j.id !== jobToDelete.value.id)
      myJobs.value = myJobs.value.filter(j => j.id !== jobToDelete.value.id)
      $toast.success('Vaga excluída com sucesso!')
    } catch {
      $toast.error('Ocorreu um erro ao excluir a vaga.')
    } finally {
      deleteDialog.value = false
      jobToDelete.value = null
    }
  }

  function logout() {
    auth.logout()
    location.reload()
  }

  function formatCurrency(value) {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
</script>

<style scoped>
  .feed-bg {
    background-color: #0d0d0d;
    color: #fff;
    min-height: 100vh;
  }

  .search-input {
    width: 100%;
    max-width: 700px;
    border-radius: 12px;
    background-color: #1a1a1a !important;
    color: #fff !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }

  .jobs-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
  }

  .job-card {
    background-color: #1c1c1c;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #f1f1f1;
    transition: all 0.2s ease;
  }

  .job-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .text-medium-emphasis {
    opacity: 0.7;
  }
</style>
