
const UrlSignIn = 'http://localhost:3000/api/signin'
const UrlUsers = 'http://localhost:3000/api/users'
const UrlLogout = 'http://localhost:3000/api/logout'
const UrlChats = 'http://localhost:3000/api/chats'
const UrlEachChats = 'http://localhost:3000/api/eachchats'
const UrlUsersAddToTheChat = 'http://localhost:3000/api/addusertochat'


export async function signInFetch(User){
    try {
        const response = await fetch(UrlSignIn,{
            method: "POST",
            body: JSON.stringify(User),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        return data
    } catch (e){
        return e
    }
}

export async function signUpFetch(User){
    try{
        const response = await fetch(UrlUsers, {
            method: "POST",
            body: JSON.stringify(User),
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await response.json()
        return data
    } catch(e){
        return e
    }
}

export async function logoutFetch(){
    try{
        const response = await fetch(UrlLogout, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem('token')
                },
        })
        const data = response.json()
        return data
    } catch(e){
        console.error("Error: ", e)
        return e
    }
}

export async function getAllChatsFetch() {
    try {
        const response = await fetch(UrlChats, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token')
            },
        })
        const data = await response.json()
        console.log(data)
        return(data)
    } catch (e) {
        return e
    }
}

export async function createChatFetch(chatInformation) {
    try {
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
    } catch (e) {
        return data
    }
}

export async function getDataToEachChat(){
    try {
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
    } catch (e){
        return e
    }
}

export async function connectOrdisconectForChat(chatInformation){
    try {
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
    } catch (e) {
        return e
    }
}