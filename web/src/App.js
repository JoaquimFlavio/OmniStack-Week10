import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './SideBar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

/*
 * Componente: Bloco isolado de HTML, CSS ou JS o qual não interfere no restante da aplicação.
 * Propriedade: Informações que um componente pai passa para um componente filho.
 * Estado: Informações mantidas pelo componente (Lembrar: imutabilidade).
 */ 

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handlerAddDev(data){
    console.log(data);
    const response = await api.post('/devs', data);

    setDevs([...devs, response.data]);
  }
  async function handlerDeleteDev(data){
    await api.delete('/devs', {data: {github_username: data.github_username}});

    var aux = [];
    devs.map(dev => {
      if(dev.github_username != data.github_username) aux.push(dev)
    })

    setDevs(aux);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handlerAddDev}/>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} del={handlerDeleteDev}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
