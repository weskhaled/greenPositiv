<script lang="ts" setup>
import Pusher from 'pusher-js'
import authApi from '~/api/modules/auth'
import agenceApi from '~/api/modules/agence'
import companyApi from '~/api/modules/company'
import freelanceApi from '~/api/modules/freelancer'
import { currentUser } from '~/stores'
const BASE_PREFIX = `${import.meta.env.VITE_API_CHAT}`
const BASE_PREFIX_AUTH = `${import.meta.env.VITE_API_AUTH}`

const user_to_talk = ref('')
const your_user_profile_image = ref('')
const receiver_user_profile_image = ref('')
const message_to_send = ref('')
const current = ref(null)
const receiver = ref(null)
const receiver_title_profile = ref('')
const messages = ref([])
const connectedUsers = ref([])
const rooms = ref([])
const users = ref([])
const listUsers = ref([])
const listImagesUsers = ref([])

const getCurrent = async (current: any) => {
  if (current.value.role === 'Freelancer') {
    await freelanceApi.profile(current.value.idUser).then(({ data }) => {
      data && (your_user_profile_image.value = data.value.freelancer.image)
    })
  }
  else if (current.value.role === 'Agence') {
    await agenceApi.profile(current.value.idUser).then(({ data }) => {
      data && (your_user_profile_image.value = data.value.agence.image)
    })
  }
  else {
    await companyApi.profile(current.value.idUser).then(({ data }) => {
      data && (your_user_profile_image.value = data.value.company.image)
    })
  }
}

const getReceiver = async (current: any) => {
  if (current.value.role === 'Freelancer') {
    await freelanceApi.profile(current.value.idUser).then(({ data }) => {
      data && (receiver_user_profile_image.value = data.value.freelancer.image) && (receiver_title_profile.value = data.value.freelancer.title_profile)
    })
  }
  else if (current.value.role === 'Agence') {
    await agenceApi.profile(current.value.idUser).then(({ data }) => {
      data && (receiver_user_profile_image.value = data.value.agence.image) && (receiver_title_profile.value = data.value.agence.nameAgence)
    })
  }
  else {
    await companyApi.profile(current.value.idUser).then(({ data }) => {
      data && (receiver_user_profile_image.value = data.value.company.image)
    })
  }
}

// send message
const sendMessage = async () => {
  console.log('here')
  const { data: dataSendMessage, error: errorSendMessage } = await useFetch(`${BASE_PREFIX}/pusher/send-message`).post({
    idSender: current.value.idUser,
    idReceiver: receiver.value.idUser,
    usernameSender: current.value.username,
    usernameReceiver: receiver.value.username,
    content: message_to_send.value,
  }).json()
  if (dataSendMessage.value && !errorSendMessage.value)
    console.log('dataSendMessage ', dataSendMessage.value)
  else
    console.log('errorSendMessage ', errorSendMessage.value)
}
// change props
const changeProps = async (idUser: any) => {
  user_to_talk.value = idUser
  await authApi.getUser(user_to_talk.value).then(async ({ data }) => {
    data && (receiver.value = data.value)
    getReceiver(receiver)

    const { data: dataAddRoom, error: errorAddRoom } = await useFetch(`${BASE_PREFIX}/pusher/connect/${current.value.idUser}`).post().json()
    if (dataAddRoom.value && !errorAddRoom.value) {
      const { data: dataConnectRoom, error: errorConnectRoom } = await useFetch(`${BASE_PREFIX}/pusher/connect-room`).post({
        idSender: current.value.idUser,
        idReceiver: receiver.value.idUser,
        usernameSender: current.value.username,
        usernameReceiver: receiver.value.username,
      }).json()
      if (dataConnectRoom.value && !errorConnectRoom.value) {
        const { data: dataMessagesRoom, error: errorMessagesRoom } = await useFetch(`${BASE_PREFIX}/chat/room/${current.value.idUser}`).post().json()
        if (dataMessagesRoom.value && !errorMessagesRoom.value) {
          messages.value = dataMessagesRoom.value.filter(m =>
            m.idReceiver === user_to_talk.value,
          ).map(msgs => msgs.messages)
          console.log('messages ', messages)
        }
      }
    }
  })
  await getFormData()
}

// init pusher
const initPusher = async () => {
  const pusher = new Pusher('70479cebefa3d9baa33f', {
    cluster: 'mt1',
    forceTLS: true,
  })
  pusher.logToConsole = true
  const channelRoom = pusher.subscribe('rooms')
  const messageRoom = pusher.subscribe('messages')
  const usersRoom = pusher.subscribe('users')

  // channel room
  channelRoom.bind('add', async (data: any) => {
    if (!rooms.value.includes(data.room._id))
      rooms.value.push(data.room._id)

    console.log('rooms', rooms)
    if (current.value.idUser === data.room.user1) {
      console.log(current.value.idUser === data.room.user1)
      if (!users.value.includes(data.room.user2))
        users.value.push(data.room.user2)
    }
    else if (current.value.idUser === data.room.user2) {
      console.log(current.value.idUser === data.room.user2)
      if (!users.value.includes(data.room.user1))
        users.value.push(data.room.user1)
    }
  })
  // message room
  messageRoom.bind('add', async (data: any) => {
    console.log('in messageRoom bind')
    console.log('data bind', data)
    messages.value[0].push(data.message)
    console.log('messages.value[0].push', messages.value[0])

    if (current.value.idUser === data.room.user1) {
      console.log(current.value.idUser === data.room.user1)
      if (!users.value.includes(data.room.user2))
        users.value.push(data.room.user2)
    }
    else if (current.value.idUser === data.room.user2) {
      console.log(current.value.idUser === data.room.user2)
      if (!users.value.includes(data.room.user1))
        users.value.push(data.room.user1)
    }
  })
  // users room
  usersRoom.bind('add', async (data: any) => {
    if (!connectedUsers.value.includes(data.idUser))
      connectedUsers.value.push(data.idUser)
  })
  usersRoom.bind('remove', async (data: any) => {
    const index = connectedUsers.value.indexOf(data.idUser)
    connectedUsers.value.splice(index, 1)
  })
}

// connect to room
const initCurrentUser = async () => {
  await authApi.currentUser().then(({ data }) => {
    data && (current.value = data)
    getCurrent(current)
  })
}
const getFormData = async () => {
  receiver_user_profile_image.value = ''
  message_to_send.value = ''
  receiver.value = null
  receiver_title_profile.value = ''
  MessageEvent.value = []
  connectedUsers.value = []
  rooms.value = []
  users.value = []
  listUsers.value = []
  listImagesUser.value = []

  const { data: dataGetRooms, error: errorGetRooms } = await useFetch(`${BASE_PREFIX}/pusher/rooms/${current.value.idUser}`).get().json()
  if (dataGetRooms.value && !errorGetRooms.value) {
    console.log('rooms ', dataGetRooms.value)
    await dataGetRooms.value.rooms.forEach(async (element) => {
      if (element.user1 === current.value.idUser) {
        const { data: dataGetUser, error: errorGetUser } = await useFetch(`${BASE_PREFIX_AUTH}/auth/get/${element.user2}`).get().json()
        if (dataGetUser.value && !errorGetUser.value) {
          console.log('user x ', dataGetUser.value)
          listUsers.value.push(dataGetUser.value)

          if (dataGetUser.value.role === 'Freelancer') {
            await freelanceApi.profile(element.user2).then(({ data }) => {
              data && (listImagesUsers.value.push(data.value.freelancer.image))
            })
          }
          else if (current.value.role === 'Agence') {
            await agenceApi.profile(element.user2).then(({ data }) => {
              data && (listImagesUsers.value.push(data.value.agence.image))
            })
          }
          else {
            await companyApi.profile(element.user2).then(({ data }) => {
              data && (listImagesUsers.value.push(data.value.company.image))
            })
          }
        }
      }
      else {
        const { data: dataGetUser, error: errorGetUser } = await useFetch(`${BASE_PREFIX_AUTH}/auth/get/${element.user1}`).get().json()
        if (dataGetUser.value && !errorGetUser.value) {
          listUsers.value.push(dataGetUser.value)

          if (dataGetUser.value.role === 'Freelancer') {
            await freelanceApi.profile(element.user1).then(({ data }) => {
              data && (listImagesUsers.value.push(data.value.freelancer.image))
            })
          }
          else if (current.value.role === 'Agence') {
            await agenceApi.profile(element.user1).then(({ data }) => {
              data && (listImagesUsers.value.push(data.value.agence.image))
            })
          }
          else {
            await companyApi.profile(element.user1).then(({ data }) => {
              data && (listImagesUsers.value.push(data.value.company.image))
            })
          }
        }
      }
    })
  }
  initPusher()
}

onMounted(async () => {
  initCurrentUser()
  getFormData()
})

</script>
<template>
  <div class="row">
    <div class="col-md-4">
      <div class="flex-1 mt-15 p:2 sm:p-6 flex flex-col h-screen overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div v-for="(user,index) in listUsers" :key="user._id">
          <div class="flex sm:items-center py-3 border-b-2 border-gray-200">
            <div class="relative flex items-center space-x-4">
              <div class="relative">
                <span class="absolute text-green-500 right-0 bottom-0">
                  <svg width="20" height="20">
                    <circle cx="8" cy="8" r="8" fill="currentColor" />
                  </svg>
                </span>
                <img :src="listImagesUsers[index]" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full">
              </div>
              <div class="flex flex-col leading-tight">
                <div class="text-2xl mt-1 flex items-center">
                  <span class="text-gray-700 mr-3">{{ user.username }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button type="button" class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none" @click="changeProps(user.idUser)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <!-- component -->
      <div class="flex-1 mt-15 p:2 sm:p-6 justify-between flex flex-col h-screen">
        <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div class="relative flex items-center space-x-4">
            <div class="relative">
              <span class="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor" />
                </svg>
              </span>
              <img :src="receiver_user_profile_image" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full">
            </div>
            <div class="flex flex-col leading-tight">
              <div class="text-2xl mt-1 flex items-center">
                <span v-if="receiver" class="text-gray-700 mr-3">{{ receiver.username }}</span>
              </div>
              <span class="text-lg text-gray-600">{{ receiver_title_profile }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          <div v-for="message in messages[0]" id="messages" :key="message._id">
            <div v-if="message.idSender === user_to_talk.value" class="chat-message">
              <div class="flex items-end">
                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{{ message.content }}</span></div>
                </div>
                <img :src="receiver_user_profile_image" alt="My profile" class="w-6 h-6 rounded-full order-1">
              </div>
            </div>
            <div v-else-if="message.idReceiver == user_to_talk.value && message.showedReceiver == false" class="chat-message">
              <div class="flex items-end justify-end">
                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                  <div>
                    <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-green-300 text-white ">{{ message.content }}</span>
                  </div>
                </div>
                <img :src="your_user_profile_image" alt="My profile" class="w-6 h-6 rounded-full order-2">
              </div>
            </div>
            <div v-else-if="message.idReceiver == user_to_talk.value" class="chat-message">
              <div class="flex items-end justify-end">
                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                  <div>
                    <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-green-600 text-white ">{{ message.content }}</span>
                  </div>
                </div>
                <img :src="your_user_profile_image" alt="My profile" class="w-6 h-6 rounded-full order-2">
              </div>
            </div>
          </div>
        </div>
        <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div class="relative flex">
            <a-input v-model:value="message_to_send" type="text" placeholder="Saisir votre message" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
            <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-green-600 hover:bg-blue-400 focus:outline-none" @click="sendMessage()">
                <span class="font-bold">Envoyer</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>
<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
  roles: [Agence, Freelancer, Company, Collab]
</route>
