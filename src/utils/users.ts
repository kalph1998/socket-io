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





export {
  addUser
}

interface user {
  id: string;
  username: string;
  room: string;
}
