const host = 'https://back-online-chat.herokuapp.com/'

const UrlSignIn = `${host}/api/signin`
const UrlUsers = `${host}/api/users`
const UrlLogout = `${host}/api/logout`
const UrlChats = `${host}/api/chats`
const UrlEachChats = `${host}/api/eachchats`
const UrlUsersAddToTheChat = `${host}/api/addusertochat`
const UrlEachChatById = `${host}/api/check-chat`
const UrlUser = `${host}/api/user`
const ChatNotifications = `${host}/api/notifications`
const DeleteChatNotifications = `${host}/api/delete/notifications`


export async function signFetch(User, target){
    let url = ''
    target == 'signIn' ? url = UrlSignIn : url = UrlUsers
    const response = await fetch(url,{
        method: "POST",
        body: JSON.stringify(User),
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data = await response.json()
    return data
}

export async function logoutFetch(){
    const response = await fetch(UrlLogout, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token')
            },
    })
    const data = response.json()
    return data

}
export async function getUser(){
    const response = await fetch(UrlUser, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token')
            },
    })
    const data = response.json()
    return data

}

export async function getAllChatsFetch() {
    const response = await fetch(UrlChats, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
        },
    })
    const data = await response.json()
    return(data)
}

export async function createChatFetch(chatInformation) {
    const response = await fetch(UrlChats, {
        method: "POST",
        body: JSON.stringify(chatInformation),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token')
            },
    })
    const data = await response.json()
    return data
}

export async function getDataToEachChat(){
    const response = await fetch(UrlEachChats, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-access-id": window.location.href.split('/').pop()
        },
    })
    const data = await response.json()
    return data
}
export async function chatNotificationsFetch(id){
    const response = await fetch(ChatNotifications,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-access-chat": id
        },
    })
    const data = await response.json()
    return data
}
export async function deleteChatNotificationsFetch(id){
    const response = await fetch(DeleteChatNotifications,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-access-chat": id
        },
    })
    const data = await response.json()
    return data
}

export async function connectOrdisconectForChat(chatInformation){
    const response = await fetch(UrlUsersAddToTheChat, {
        method: "POST",
        body: JSON.stringify(chatInformation),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token')
            },
    })
    const data = response.json()
    return data
}

export async function getInformationEachChatById(id){
    const response = await fetch(UrlEachChatById, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-access-id": id
        },
    })
    const data = await response.json()
    return data
}