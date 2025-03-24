const title = document.querySelector('.title');

const login = document.querySelector('.login');
const loginForm = document.querySelector('.login_form');
const loginInput = document.querySelector('.login_input');
const loginButton = document.querySelector('.login_button');

const chat = document.querySelector('.chat');
const chatForm = document.querySelector('.chat_form');
const chatInput = document.querySelector('.chat_input');
const chatMessage = document.querySelector('.chat_message');

//armazena os dados do usuário
const user = {id:"", name:"", color:""}; 

//cores disponíveis
const colors = [
    'aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy',
    'olive', 'purple', 'red', 'silver', 'teal', 'yellow'
]

//variável que vai armazenar o websocket
let websocket

//função que cria um elemento de mensagem
const createMessageSelfElement = (content) => {
    const div = document.createElement('div');
    div.classList.add('message--self');
    div.innerHTML = content

    return div;
}

//função que cria um elemento de mensagem o remetente
const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement('div');
    const span = document.createElement('span');

    div.classList.add('message--other');
    div.classList.add('message--sender');
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender
    div.innerHTML += content

    return div;
}


//função que retorna uma cor aleatória
const getRandomColor = () => {
    const randomIndex  = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
}
//função que faz a tela rolar para o final
const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

//função que processa a mensagem recebida do servidor
const processMessage = ({data}) => {
    const {userId, userName, userColor, content} = JSON.parse(data);

    const message = userId === user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor);


    //o element é adicionado ao chatMessage
    chatMessage.appendChild(message);

    scrollScreen();

    console.log(data);
    
};

//função que envia a mensagem para o servidor
const handleSumit = (event) => {
    event.preventDefault();

    title.style.display = 'none';

    user.id = crypto.randomUUID();
    user.color = getRandomColor();
    user.name = loginInput.value

    login.style.display = 'none';
    chat.style.display = 'flex';

    //vai conectar com o servidor
    websocket = new WebSocket(`wss://devchat-rbkc.onrender.com`);

    //quando receber uma mensagem do servidor, chama a função processMessage
    websocket.onmessage = processMessage;

    console.log(user);

}

//função que envia a mensagem para o servidor
const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    //envia a mensagem para o servidor no formato JSON(string)
    websocket.send(JSON.stringify(message));

    chatInput.value = '';


}

loginForm.addEventListener('submit', handleSumit);
chatForm.addEventListener('submit', sendMessage);