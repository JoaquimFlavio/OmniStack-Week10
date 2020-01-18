

# Dev-Radar

> O Dev-Radar foi desenvolvido durante a 10˚ semana OmniStack, com base na OmniStack, isso é: ***Back-and, Web, Mobile*** utilizando Node.js e React
>
>
> *Agradecimento a equipe [RockSeat](https://rocketseat.com.br/)*

### Interface Web

![Web](/Users/joaquimflavio/Documents/OmniStack-Week10/screenshots/Web.png)

<img src="screenshots/mobile 1.jpg" alt="mobile 1" style="zoom:25%;" /><img src="screenshots/mobile 2.jpg" alt="mobile 2" style="zoom:25%;" /><img src="/Users/joaquimflavio/Documents/OmniStack-Week10/screenshots/mobile cliked.jpg" alt="mobile cliked" style="zoom:25%;" /><img src="/Users/joaquimflavio/Documents/OmniStack-Week10/screenshots/mobile - profiles.jpg" alt="mobile - profiles" style="zoom:25%;" />



## Instalação

Editar `mobile/src/services/socket.js` e atualizar o IP.

```javascript
const socket = socketio('http://192.168.1.100:3333', {
    autoConnect: false,
});
```

Editar `mobile/src/services/api.js` e atualizar o IP.

```javascript
const api = axios.create({
    baseURL: 'http://192.168.1.100:3333',
});
```

Execute em 3 terminais diferentes:

```shell
#Terminal 1
cd backend
npm install
node src/index.js
```

```shell
#Terminal 2
cd web
npm install
npm start
```

```shell
#Terminal 3
cd mobile
npm istall
npm start
```



## Criação comandos

### Web

```shell
npx create-react-app web
```

###Native

```bash
npm install -g expo-cli
expo init mobile
```

###### Links de apoio

- [facebook](https://facebook.github.io/react-native/docs/getting-started)

- [rocketseat](https://docs.rocketseat.dev/ambiente-react-native/android/macos)

