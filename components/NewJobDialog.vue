<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="pa-6 rounded-xl" color="#1b1b1b">
      <h2 class="text-h6 mb-4">{{ isEditing ? 'Editar vaga' : 'Cadastrar nova vaga' }}</h2>

      <v-text-field v-model="form.title" label="Título da vaga" variant="outlined" color="primary" class="mb-4" />
      <v-textarea v-model="form.description" label="Descrição" variant="outlined" color="primary" rows="3" class="mb-4" />

      <v-select
        v-model="form.typeLocation"
        :items="[
          { title: 'Remoto', value: 'REMOTE' },
          { title: 'Híbrido', value: 'HYBRID' },
          { title: 'Presencial', value: 'ONSITE' }
        ]"
        item-title="title"
        item-value="value"
        label="Localização"
        variant="outlined"
        color="primary"
        class="mb-4"
      />

      <v-text-field v-model="form.salary" label="Salário" variant="outlined" color="primary" class="mb-6" />

      <div class="d-flex justify-end gap-3">
        <v-btn variant="tonal" color="grey" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="submit">
          {{ isEditing ? 'Salvar alterações' : 'Cadastrar' }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: Boolean,
    editData: Object
  })
  const emit = defineEmits(['update:modelValue', 'add-job', 'update-job'])

  const { $toast } = useNuxtApp()

  const dialog = ref(props.modelValue)
  const isEditing = ref(false)
  const form = ref({ id: null, title: '', description: '', typeLocation: '', salary: '' })

  watch(() => props.modelValue, val => (dialog.value = val))
  watch(dialog, val => emit('update:modelValue', val))

  watch(
    () => props.editData,
    data => {
      if (data) {
        isEditing.value = true
        form.value = {
          id: data.id,
          title: data.title,
          description: data.description,
          salary: data.salary,
          typeLocation: data.typeLocation || ''
        }
      } else {
        isEditing.value = false
        Object.keys(form.value).forEach(k => (form.value[k] = ''))
      }
    },
    { immediate: true }
  )

  function closeDialog() {
    dialog.value = false
  }

  function submit() {
    if (!form.value.title || !form.value.description || !form.value.typeLocation || !form.value.salary) {
      $toast.warn('Preencha todos os campos.')
      return
    }

    const jobData = { ...form.value, typeLocation: form.value.typeLocation.toUpperCase() }

    if (isEditing.value) emit('update-job', jobData)
    else emit('add-job', jobData)

    closeDialog()
  }
</script>
