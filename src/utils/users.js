const users = []

//addUser, removeUser, getUser, getUserInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room) return { error: 'Username & Room are both required' }

    // Check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) return { error: 'The username has been taken in this room!' }

    // Store user
    const user = ({ id, username, room })
    users.push(user)
    return { user }
} 

const removeUser = (id) => {
    const index = users.findIndex( user => user.id === id) // No match would return -1
    
    if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// // Testing
// addUser({
//     id: 22,
//     username: 'Bucks',
//     room: 'Star'
// })
// addUser({
//     id: 33,
//     username: 'Fish',
//     room: 'Star'
// })
// addUser({
//     id: 44,
//     username: 'Fish',
//     room: 'Jelly'
// })
// console.log(users)

// const userGot = getUser(22)
// const usersNotGot = getUser(21)
// console.log(userGot, usersNotGot)

// const inRoom = getUsersInRoom('star')
// const notInRoom = getUsersInRoom('Jelly')
// console.log(inRoom, notInRoom)

// const removedUserOne = removeUser(22)
// const removedUserTwo = removeUser(33)
// const removedUserThree = removeUser(44)
// console.log(users, removedUserOne, removedUserTwo, removedUserThree)

