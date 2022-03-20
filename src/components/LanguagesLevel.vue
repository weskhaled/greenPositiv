<script setup lang="ts">import { message } from 'ant-design-vue'

const props = defineProps<{
  languages: {
    type: Array<any>
    required: false
    default: []
  }
  modelValue: {
    type: Array<any>
    required: false
    default: []
  }
}>()
const emit = defineEmits(['update:modelValue', 'addLanguage', 'removeLanguage', 'updateLanguage'])
const data = useVModel(props, 'modelValue', emit)

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: 'level',
    dataIndex: 'level',
    width: '40%',
  },
  {
    title: 'operation',
    dataIndex: 'operation',
  },
]
interface DataItem {
  key: string
  name: string
  level: number
}

const levels = [
  { lable: 'Notions', value: 'BASIC' },
  { lable: 'Capacité professionnelle limitée', value: 'CONVERSATIONAL' },
  { lable: 'Capacité professionnelle complète', value: 'FLUENT' },
  { lable: 'Bilingue ou natif', value: 'NATIVE' },
]

const dataSource = ref(data.value.map(l => ({ ...l, key: l.name })))
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({})

const add = () => {
  const hasOne = dataSource.value.find(l => l.key === 'new')
  if (!hasOne) {
    const newData = {
      key: 'new',
      name: undefined,
      level: undefined,
      editableData: true,
    }
    editableData.new = { ...newData }
    dataSource.value.push(newData)
  }
}
const edit = (key: string) => {
  editableData[key] = { ...dataSource.value.filter(item => key === item.key)[0] }
}
const save = (key: string) => {
  const { level, name } = editableData[key]

  if (level && name) {
    if (editableData[key].key !== 'new')
      emit('updateLanguage', { language: { level, name } })

    else
      emit('addLanguage', { language: { level, name } })
  }
  else {
    message.error('please fill input')
  }
}
const remove = (key: string) => {
  const language = dataSource.value.find(l => l.name === key)
  if (language !== 'new')
    emit('removeLanguage', { language })
}
const cancel = (key: string) => {
  delete editableData[key]
}
onMounted(() => {
  !data.value.length && add()
})
</script>

<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="['name', 'level'].includes(column.dataIndex)">
          <div>
            <template v-if="editableData[record.key]">
              <a-select
                v-if="column.dataIndex == 'name'"
                v-model:value="editableData[record.key][column.dataIndex]"
                class="w-full"
                placeholder="Please select a langues"
                :options="props.languages"
              />
              <a-select
                v-else-if="column.dataIndex == 'level'"
                v-model:value="editableData[record.key][column.dataIndex]"
                class="w-full"
                placeholder="Please select a level"
                :options="levels"
              />
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link class="mr-4" @click="save(record.key)">Save</a-typography-link>
              <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                <a-typography-link class="mr-4">Cancel</a-typography-link>
              </a-popconfirm>
            </span>
            <span v-else>
              <a-typography-link class="mr-4" @click="edit(record.key)">Edit</a-typography-link>
              <a-popconfirm title="Sure to cancel?" @confirm="remove(record.key)">
                <a-typography-link class="mr-4">Delete</a-typography-link>
              </a-popconfirm>
              <a-typography-link v-if="index === dataSource.length - 1" class="mr-4" @click="add">Add</a-typography-link>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
