import React from 'react';

import './style.css';

function DevItem({ dev, del }) {
    async function deleteDev(){
        await del(dev);
    }

    return(
        <li className="dev-item">
            <header>
                <img src={dev.avatar_url} alt={dev.name}></img>
                <div className="user-info">
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                </div>
            </header>
            <body>
                <p>{dev.bio}</p>
            </body>
            <pady> 
                <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no GitHub</a>
                <tools>
                    <i  class="material-icons">edit</i>
                    <i onClick={deleteDev} class="material-icons">delete</i>
                </tools>
            </pady>
        </li>
    )
}

export default DevItem;