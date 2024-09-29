'use client';
import { useEffect, useReducer, useState } from "react"

const reducer = (state, action) => {
  if (action.type === "NAME") {
    const newName = action.payload.toLowerCase()
    return { ...state, name: newName };
  }
  if (action.type === "FETCH_START") {
    return { ...state, load: true };
  }
  if (action.type === "FETCH_SUCSESS") {

    const names = action.payload.filter((persons)=> persons.login.includes(state.name))
    return { ...state, user:names ,load:false,name:""};
  }
  if (action.type === "ERROR") {
    return { ...state, user:[]};
  }

}




const initialState = {
  name:"",
  load:false,
  user:[]

};






export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
 const url =`https://api.github.com/search/users?q=${state.name}`;
const isDisabled=!state.name.length>0
const handleClick = () => {

    dispatch({ type: "FETCH_START" });
    fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      dispatch({ type: "FETCH_SUCSESS",payload:data.items });
      
    })
    .catch((error) => {
      console.error("Hata:", error);
      dispatch({ type: "ERROR"});
    });
  
};


return (
  <>
    <h1 className="text-2xl font-bold text-center my-4">Project 5: GitHub User Search</h1>
    <div className="flex justify-center mb-4">
      <input 
        type="text" 
        value={state.name} 
        onChange={(e) => { dispatch({ type: "NAME", payload: e.target.value }); }} 
        placeholder="İsim giriniz"
        className="border border-gray-300 rounded p-2 w-1/3"
      />
      <button 
        type="button" 
        disabled={isDisabled}
        onClick={handleClick}
        className={`ml-2 p-2 rounded ${isDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
      >
        Search
      </button>
    </div>
    <div className="text-center">
      {state.load ? (
        <p className="text-lg">Yükleniyor...</p>
      ) : (
        state.user.length > 0 ? (
          <ul className="list-disc">
            {state.user.map((person) => (
              <li key={person.id} className="flex items-center justify-center my-2">
                <img src={person.avatar_url} alt={person.login} width="50" className="rounded-full" />
                <a href={person.html_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">{person.login}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">Kullanıcı bulunamadı.</p>
        )
      )}
    </div>
  </>
);
}
