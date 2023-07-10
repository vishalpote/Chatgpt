import { useState ,useEffect} from 'react';
import axios from "axios";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingicon from "./assets/loader.svg";
import bot from "./assets/bot.png";

//  let arr=[
  //  {type:"user",post:"xxxxxxxxxxx"},
  //  {type:"bot",post:"xxxxxxxxxxx"}
//  ]

function App() {
const [input,setInput]=useState("");
const [posts,setPosts]=useState([]);

useEffect(()=>{
document.querySelector(".layout").scrollTop=document.querySelector(".layout").scrollHeight
},[posts]);

const featchBotResponse=async ()=>{
    const{data}=await axios.post("http://localhost:5000",{input},{
      headers:{
        "Content-Type":"application/json",
      },
    });
      return data;

};

const onSubmit=()=>{
      if(input.trim()==="")return;
      updatePosts(input);
      updatePosts("loading...",false,true);
      setInput("")
      featchBotResponse().then((res) =>{
        console.log(res);
        updatePosts(res.bot.trim(),true);
      });
}

const autoTypingBotResponse=(text)=>{
    let index=0
    let interval=setInterval(()=>{
      if(index < text.length)
      {
        setPosts((prevState)=>{
          let lastItem=prevState.pop();
          if(lastItem.type !=="bot")
          {
              prevState.push({
                type:"bot",
                post:text.charAt(index-1)
              })
          }
          else
          {
            prevState.push({
              type:"bot",
              post:lastItem.post+ text.charAt(index-1),})
            }
            return [...prevState];
        });
          index++;
      }
      else
      {
        clearInterval(interval);
      }
    },30);


}

const updatePosts=(post,isBot,isLoading)=>{
  if(isBot)
  {
    autoTypingBotResponse(post);
  }
  else
  {
    setPosts(prevState =>{ return [...prevState,{type:isLoading?"loading":"user",post}]
  });
  }
  

};

const onKeyUp=(e)=>{
  if(e.key==="Enter" || e.which===13)
    {
      onSubmit();
    }
}


  return (
    <main className="chatGPT-app">
      <section className='chatcantainer'>
        <div className="layout">
          {posts.map((post ,index)=>(
            <div
            key={index} 
            className={`chat-bubble ${posts.type==="bot" || posts.type==="loading"?"bot":""}`}>
            <div className="avatar">
              <img src={posts.type==="bot" || posts.type==="loading"? bot : user } />
            </div>
            {post.type==="loading"?(
              <div className="loader">
              <img src={loadingicon} />
            </div>
            ):(
              <div className="post" style={{background:'rgb(240, 240, 240)',borderRadius:'0px',fontFamily:'initial',fontSize:'20px',fontWeight:'200px'}}>{post.post}</div>
            )}
            
          
          </div>
          ))}


        </div>
      </section>
      <footer>
        <input 
        value={input}
        className='composebar'
        autoFocus
        type="text"
        placeholder='Ask Anything'
        onChange={(e)=>setInput(e.target.value)}
        onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  )
}

export default App
