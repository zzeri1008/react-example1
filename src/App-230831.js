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

/*
update 기능을 구현해보자

===>
update 컴포넌트의 구조는 create와 비슷하지만 차이점이 있다.
update를 할 때는 수정할 값의 초기 값을 읽어와야 하는데, 이 값(props)을 상태로 변환해주어야 한다.

const [title, setTitle] = useState(props.title);
const [body, setBody] = useState(props.body);

props는 사용자가 컴포넌트로 전달하는 일종의 "명령"으로 우리가 직접 제어할 수 없다.
따라서 이 값을 내부적으로 변경 가능한 상태로 변환해주어야 한다.
상태는 컴포넌트 내부에서 값을 변경할 수 있는데, 이를 통해 우리가 수정할 값을 처리할 수 있다.


값을 변경할 때 사용하는 이벤트는 onChange이다.
일반 HTML에서 동작과 React에서의 동작에 차이점이 있다.
HTML에서는 값이 바뀌고 마우스 포인트가 요소 밖으로 빠져나갈 때 호출되지만, React에서는 값이 변경될 때마다 호출된다.
이 점을 이용하여 이벤트가 발생한 대상의 값을 상태로 갱신하여 화면에 보여지도록 할 수 있다.

<p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
      setTitle(event.target.value);
   }
}/></p>
*/
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
      contextControll =  <li><a href={'/update/'+id} onClick={event => {
          event.preventDefault();
          setMode('UPDATE');
        }
      }>Update</a></li>
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
