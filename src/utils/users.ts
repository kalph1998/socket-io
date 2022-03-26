import e from "express";

const users: user[] = [];

// add user

const addUser = ({ id, username, room }: user) => {
  //clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username || !room) {
    return {
      error: "userName and room are required",
    };
  }

  //check for existing user

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "username already exists",
    };
  }

  // store user

  const user = { id, username, room }

  users.push(user)
  return { user }


};

// addUser({
//   id: 22,
//   username: 'Andrews',
//   room: 'south philly'
// })
// addUser({
//   id: 22,
//   username: 'Andrew',
//   room: 'south philly'
// })
// addUser({
//   id: 22,
//   username: 'Andrew',
//   room: 'north philly'
// })




const removeUser = (id: string | number) => {
  const index = users.findIndex((user) => {
    return user.id === id
  })

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id: string | number) => {

  const user = users.find((user) => {
    return user.id === id
  })

  return user

}

const getUsersInRoom = (roomName: string) => {
  roomName = roomName.trim().toLowerCase()
  const usersInRoom = users.filter((user) => {
    return user.room === roomName
  })

  return usersInRoom

}







export {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

interface user {
  id: string | number;
  username: string;
  room: string;
}
