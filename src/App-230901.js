import './App.css';
import { useState } from 'react';

const Header = (props) => {
    return <header>
        <h1><a href="/" onClick={(event)=>{
            event.preventDefault();
            props.onChangeMode();
        }
        }>{props.title}</a></h1>
    </header>
}

const Nav = (props) => {
  const lis = [];

  for(let i=0; i<props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event => {
          event.preventDefault();
          props.onChangeMode(Number(event.target.id));
        }
      }>{t.title}</a>
    </li>)
  }

  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

const Article = (props) => {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

const Create = (props) => {
    return <article>
        <h2>Create</h2>
        <form onSubmit={event => {
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onCreate(title, body);
        }}>
            <p><input type="text" name="title" placeholder="title"/></p>
            <p><textarea name="body" placeholder="body"></textarea></p>
            <p><input type="submit" value="Create"/></p>
        </form>
    </article>
}

const Update = (props) => {
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    return <article>
        <h2>Update</h2>
        <form onSubmit={event => {
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onUpdate(title, body);
        }}>
            <p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
                    setTitle(event.target.value);
                }
            }/></p>
            <p><textarea name="body" placeholder="body" value={body} onChange={event => {
                    setBody(event.target.value);
                }
            }></textarea></p>
            <p><input type="submit" value="Update"/></p>
        </form>
    </article>
}

/*
Delete 기능을 구현해보자

===>

delete 기능은 페이지 이동이 필요 없으므로 별도의 컴포넌트를 생성할 필요가 없다.
간단히 버튼을 추가하고 onClick 이벤트에 삭제 기능을 구현하면 된다.

일반적으로 삭제 기능은 상세페이지 내부에서 발생하므로, 'READ' 모드일 때 contextControl을 수정하면 된다.
제목이 없는 태그를 사용하는 이유는 리액트에서 태그를 그룹화하기 위함이다.
리액트에서는 하나의 태그 안에 들어가야 하기 때문에, 제목이 없는 태그를 사용하여 복수의 태그를 그룹화할 수 있다.

contextControll =  <>
          <li><a href={'/update/'+id} onClick={event => {
          event.preventDefault();
          setMode('UPDATE');
        }
      }>Update</a></li>
       <input type="button" value="Delete" onClick={ () => {
           const newTopics = [];
           for(let i=0; i<topics.length; i++) {
               if(topics[i].id !== id) {
                   newTopics.push(topics[i]);
               }
           }

           setTopics(newTopics);
           setMode('WELCOME');
        }
       }/>
</>

*/
const App = () => {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [topics, setTopics] = useState([
    {id:1, title: 'html', body:'html is ...'},
    {id:2, title: 'css', body:'css is ...'},
    {id:3, title: 'javascript', body:'javascript is ...'}
  ]);
  const [nextId, setNextId] = useState(topics.length+1);

  let content = null;
  let contextControll = null;

  if(mode === 'WELCOME') {
      content =  <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if(mode === 'READ') {
      let title, body = null;
      for(let i=0; i<topics.length; i++) {
          if(topics[i].id === id) {
              title = topics[i].title;
              body = topics[i].body;
          }
      }
      content =  <Article title={title} body={body}></Article>
      contextControll =  <>
          <li><a href={'/update/'+id} onClick={event => {
          event.preventDefault();
          setMode('UPDATE');
        }
      }>Update</a></li>
       <input type="button" value="Delete" onClick={ () => {
           const newTopics = [];
           for(let i=0; i<topics.length; i++) {
               if(topics[i].id !== id) {
                   newTopics.push(topics[i]);
               }
           }

           setTopics(newTopics);
           setMode('WELCOME');
        }
       }/>
      </>
  } else if(mode === 'CREATE') {
      content = <Create onCreate={(_title, _body) => {
          const newTopic = {id:nextId, title: _title, body: _body};
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          setMode('READ');
          setId(nextId);
          setNextId(nextId+1);
        }
      }></Create>
  } else if(mode === 'UPDATE') {
      let title, body = null;
      for(let i=0; i<topics.length; i++) {
          if(topics[i].id === id) {
              title = topics[i].title;
              body = topics[i].body;
          }
      }

      content = <Update title={title} body={body} onUpdate={(title, body) => {
            const updatedTopic = {id, title, body};
            const newTopics = [...topics];
            for(let i=0; i<newTopics.length; i++) {
                if(newTopics[i].id === id) {
                    newTopics[i] = updatedTopic;
                    break;
                }
            }

            setTopics(newTopics);
            setMode('READ');
        }
      }></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={()=> {
          setMode('WELCOME');
        }
      }></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
          setMode('READ');
          setId(_id);
        }
      }></Nav>
      {content}
      <li><a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREATE');
        }
      }>Create</a></li>
      {contextControll}
    </div>
  );
}

export default App;
