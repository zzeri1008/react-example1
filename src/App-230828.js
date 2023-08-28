import './App.css';

const Header = (props) => {
    return <header>
        <h1><a href="/" onClick={(event)=>{
            event.preventDefault();
            props.onChangeMode();
        }
        }>{props.title}</a></h1>
    </header>
}

/*
컴포넌트 예제
아래와 같이 여러개의 li 태그로 선언된 내용을 간결하게 작성하려면 어떻게 해야할까?
<nav>
  <ol>
    <li><a href="/read/1">html</a></li>
    <li><a href="/read/2">css</a></li>
    <li><a href="/read/3">js</a></li>
  </ol>
</nav>


==>

1. App 컴포넌트에 topics 배열을 선언
  const topics = [
    {id:1, title: 'html', body:'html is ...'},
    {id:2, title: 'css', body:'css is ...'},
    {id:3, title: 'javascript', body:'javascript is ...'}
  ];

2. App 컴포넌트에 선언된 Nva 컴포넌트에 topics 속성 선언: topics={topics}

3. Nav 컴포넌트로 돌아가서 아래와 같이 코드를 작성
const Nav = (props) => {
   const lis = [];

   for(let i=0; i<props.topics.length; i++) {
      let t = props.topics[i];
      lis.push(<li><a href={'/read/'+t.id}>{t.title}</a></li>);
   }

   return <nav> <ol> {lis} </ol> </nav>
}


❗❗❗
그러나 위와 같이 코드를 작성할 경우 "Warning: Each child in a list should have a unique 'key' prop." 에러가 발생할 수 있다.
이는 for문으로 생성된 li 태그에는 각각 고유한 "key" prop이 필요하다는 뜻이다.
이 문제를 해결하려면 각각의 li 태그에 고유한 key 값을 지정해야 한다. 예: <li key={t.id}>

이와 같은 설정을 하는 이유는 for문으로 생성된 태그들을 식별하기 위해서이다.
"key"라는 특별한 prop을 제공함으로써 리액트는 성능을 최적화하고 정확한 동작을 수행할 수 있다.
*/

/*
이벤트 예제
for문으로 생성된 각 li 태그의 내부 a 태그를 클릭하면 해당 id 값을 알림창으로 표시하는 이벤트를 어떻게 선언해야할까?

===>

1. App 컴포넌트 내부에 선언된 Nav 컴포넌트에 아래와 같이 on라는 속성을 선언하고 알림창을 보여주는 함수를 작성
<Nav topics={topics} onChangeMode={(id)=>{alert(id);}}></Nav>

2. Nav 컴포넌트로 이동해서 아래와 같이 코드를 작성
for(let i=0; i<props.topics.length; i++) {
   let t = props.topics[i];
   lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id}
         onClick={event => {
            event.preventDefault();
            props.onChangeMode(event.target.id);
           }
         }>{t.title}</a>
      </li>
   );
}

a 태그 내부에 id={t.id}를 선언하여 id 값을 설정해주고, 이 값을 추적하기 위해 이벤트 객체를 활용한다. event.target.id


!!! 어차피 for문을 돌리니깐 그냥 t.id 사용하면 되는게 아닌가??
t.id로 선언하면 이것이 무엇을 의미하는지 바로 알수 없다.
event.target.id 을 이용하면 바로 위에 있는 a태그의 id 값을 나타내는 구나! 라고 바로 이해할 수 있는 보기 쉬운 코드가 된다.

❗❗❗
for문을 사용하기에 t.id로 클릭한 a 태그의 id 값을 바로 얻을 수 있다. 그러나 t.id만 사용하면 의미를 명확하게 이해하기 어려울 수 있다.
event.target.id를 사용하는 이유는 바로 위의 a 태그의 id 값을 의미하는 구나! 라고 바로 이해할 수 있기 때문이다.
*/
const Nav = (props) => {
  const lis = [];

  for(let i=0; i<props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event => {
          event.preventDefault();
          props.onChangeMode(event.target.id);
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
const App = () => {
  const topics = [
    {id:1, title: 'html', body:'html is ...'},
    {id:2, title: 'css', body:'css is ...'},
    {id:3, title: 'javascript', body:'javascript is ...'}
  ];

  return (
    <div>
      <Header title="WEB" onChangeMode={()=> {
          alert('Header');
        }
      }></Header>
      <Nav topics={topics} onChangeMode={(id)=>{
          alert(id);
        }
      }></Nav>
      <Article title="Welcome" body="Hello, WEB"></Article>
    </div>
  );
}

export default App;
