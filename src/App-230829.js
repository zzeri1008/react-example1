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

/*
state 예제
목록을 클릭했을 때 Article 컴포넌트의 내용을 제어해 보자.

===>

1. useState를 import 한다.
   import React, { useState } from 'react';

2. App 컴포넌트에서 useState를 사용하여 state의 초기 값과 변경 값을 제어해준다.
   const [id, setId] = useState(null);
   이때, useState의 첫 번째 인자 id는 state의 초기 값이며, 두 번째 인자 setId는 state의 값을 변경할 수 있는 함수이다.

3. mode가 "READ"일 때, topics에 선언된 값들을 통해 title과 body를 설정해준다.

   let title, body = null;
   for(let i=0; i<topics.length; i++) {
      if(topics[i].id === id) {
         title = topics[i].title;
         body = topics[i].body;
      }
   }
   content =  <Article title={title} body={body}></Article>

4. 여기서 주의해야 할 점은 App 컴포넌트에 선언된 Nav 컴포넌트 이벤트에 _id를 통해 topics의 값을 찾아오도록 설정되어 있다는 점이다.
   Nav 컴포넌트에는 해당 id를 다음과 같이 넘겨주도록 되어 있다.
   props.onChangeMode(event.target.id);
   반환되는 id는 '문자열'로 반환되므로 topics에서 index로 값을 찾아올 수 없기 때문에 Number() 함수를 사용하여 숫자로 변환해주어야 한다.

❗❗❗
왜 useState를 사용해야 할까?
App 컴포넌트는 한 번 렌더링되면 다시 실행되지 않기 때문에 return 값에 변화가 없다.
값이 바뀌려면 이 컴포넌트가 다시 실행되면서 값이 변경되어야 하는데 이를 도와주는 것이 바로 useState이다.
useState는 상태의 변화를 감지하고 컴포넌트를 필요한 경우에만 다시 렌더링하게 해준다.

 */
const App = () => {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const topics = [
    {id:1, title: 'html', body:'html is ...'},
    {id:2, title: 'css', body:'css is ...'},
    {id:3, title: 'javascript', body:'javascript is ...'}
  ];

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
    </div>
  );
}

export default App;
