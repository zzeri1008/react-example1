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
Create 기능을 구현해보자

===>

지금까지 배워왔던 컴포넌트, prop, useState를 사용하여 create 기능을 구현해보자
단, 데이터를 입력받아야 하므로 form 태그를 활용해야 한다.

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


form 태그에서 데이터를 전송할 때 사용하는 이벤트인 onSubmit도 페이지가 재랜더링되므로 event.preventDefault();를 사용하여 기본 동작을 막아야 한다.
그리고 input과 textarea에 name 속성으로 설정한 title과 body 값을 가져오기 위해 event.target을 이용하여 이벤트가 발생한 요소의 값을 가져오도록 한다.
이때 '값'을 가져와야 하므로 뒤에 value를 붙여주는 것을 잊지 말자!

title과 body에 대한 값을 전달했으면, 이를 화면에 보여주는 작업을 하러가자

[mode가 CREATE 일 경우]

const newTopic = {id:nextId, title: _title, body: _body};

title과 body는 form 태그에서 전달받았지만, 새로 추가되는 항목에 대한 id 값은 전달받지 못했다. 이를 어떻게 해야 할까?

const [nextId, setNextId] = useState(topics.length+1);
useState의 초기값을 topics 배열의 길이에 1을 더한 값으로 설정해서 id를 동적으로 관리해준다.

id에 대한 상태 관리를 했으면, topics도 마찬가지로 상태로 관리하자
const [topics, setTopics] = useState([
    {id:1, title: 'html', body:'html is ...'},
    {id:2, title: 'css', body:'css is ...'},
    {id:3, title: 'javascript', body:'javascript is ...'}
]);
topics 배열에 newTopic을 추가한 후 setTopics(topics)를 호출하면 끝났다고 생각했겠지만 아쉽게도 아니다

상태를 만들 때 상태의 데이터가 원시데이터 타입일 때는 기존 방식대로 useSate를 사용하면 되지만,
만약에 내가 만들려는 데이터가 범 객체라면 처리 방법이 달라진다.
이때는 데이터를 복제 하고, 그 복제본에 값을 변경한다음 사용해주어야 한다!

복제 방법
newValue = {...value};   -- 객체
newValue = [...value];   -- 배열

**
... 은 Spread 문법으로 배열이나 객체의 요소를 펼쳐서 다른 배열이나 객체에 복사하거나 병합하는 문법이다. ES6에서 새롭게 추가됨!

자세한 내용은 seomal.com/map/1/55를 참조

**
useState는 아래와 같이 초기값이 1로 선언되어 있을 때,
const [value, setValue] = useState(1);

만약 아래와 같이 새로운 값으로 선언하면 기존의 값과 변경된 값을 비교하여 재랜더링을 한다.
setValue(2);
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
      <a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREATE');
        }
      }>Create</a>
    </div>
  );
}

export default App;
