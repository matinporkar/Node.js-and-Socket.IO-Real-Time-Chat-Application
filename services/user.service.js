
const users = [];

export function joinUser(id, username, room) {

    const user = { id, username, room };

    users.push(user);

    return user;
}


export function getCurrentuser(id) {

    return users.find(user => user.id === id);;
}


export function userLeave(id) {

    const user = users.findIndex(user => user.id === id);

    if (user !== -1) {
        return users.splice(user, 1)[0];
    }
}


export function getRoomUsers(room) {

    return users.filter(user => user.room === room);
}