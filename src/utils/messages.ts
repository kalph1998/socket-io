const generateMessage = (username: string, text: string): createdMessage => {
  return {
    text,
    createdAt: new Date().getTime(),
    username
  };
};

const generateLocationMessage = (username: string, url: string): createdLocation => {
  return {
    createdAt: new Date().getTime(),
    url,
    username
  };
};

interface createdMessage {
  text: string;
  createdAt: number;
  username: string
}
interface createdLocation {
  url: string;
  username: string;
  createdAt: number;
}

export { generateMessage, generateLocationMessage };
