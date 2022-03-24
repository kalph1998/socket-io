const generateMessage = (text: string): createdMessage => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (url: string): createdLocation => {
  return {
    createdAt: new Date().getTime(),
    url,
  };
};

interface createdMessage {
  text: string;
  createdAt: number;
}
interface createdLocation {
  url: string;
  createdAt: number;
}

export { generateMessage, generateLocationMessage };
