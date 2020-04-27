const UrlSignIn = 'http://localhost:3000/api/signin'
const UrlUsers = 'http://localhost:3000/api/users'
const UrlLogout = 'http://localhost:3000/api/logout'
const UrlChats = 'http://localhost:3000/api/chats'
const UrlEachChats = 'http://localhost:3000/api/eachchats'
const UrlUsersAddToTheChat = 'http://localhost:3000/api/addusertochat'
const UrlEachChatById = 'http://localhost:3000/api/check-chat'
const UrlUser = 'http://localhost:3000/api/user'

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
    console.log('fetch id', id)
    const response = await fetch(UrlEachChatById, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-access-id": id
        },
    })
    const data = await response.json()
    console.log('data in fetch',data)
    return data
}