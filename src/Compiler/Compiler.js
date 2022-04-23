import React, { useState } from "react";
import "./Compiler.css";
import Progess from "./Progess";
export default function Compiler() {

  const [input, setInput] = useState(localStorage.getItem('input') || ``);
  const [user_input, setUserInput] = useState(``);
  const [width, setWidth] = useState("0");


  const inputFun = (event) => {
    event.preventDefault();
    setInput(event.target.value);
    localStorage.setItem('input', event.target.value)
  };

  const userInput = (event) => {
    event.preventDefault();
    setUserInput(event.target.value);

  };
  const submit = async (e) => {
setWidth("10%")
    e.preventDefault();
    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    setWidth("30%")

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "12dd129422mshdcab2b29666fb5cp17493cjsna3e6f55742cf",
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          
          source_code: input,
          stdin: user_input,
          language_id: 50, //C specific id
        }),
      }
    );
    setWidth("60%");
    
    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    setWidth("70%");

    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "12dd129422mshdcab2b29666fb5cp17493cjsna3e6f55742cf",
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }
    setWidth("90%");

    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      outputText.innerHTML = "";
      outputText.innerHTML += `Output :\n${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
    setWidth("100%");

  };

  return (
    <>
    
    {width!="100%" && <Progess width={width}/>}
      <h1 className="center">C Online Code Editor</h1>
      <div className="row container-fluid">
        <div className="col-7  ml-4 ">
          <label htmlFor="solution ">
            <span className="My-Badge">
              <i className="fas fa-code fa-fw fa-lg"></i> Code Here
            </span>
          </label>
          <textarea
            required
            name="solution"
            id="source"
            onChange={inputFun}
            className=" source"
            value={input}
          ></textarea>
          <button
            type="submit"
            className="btn btn-danger mt-3 ml-2 mr-2 "
            onClick={submit}
          >
            <i className="fas fa-cog fa-fw"></i> Run
          </button>

        </div>
        <div className="col-3">

          <div>
            <span className="My-Badge OutputBadge">
              Output
            </span>
            <textarea id="output"></textarea>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-4 ml-4">

        <span className="My-Badge UserBadge">
          User Input
        </span>
        <br />
        <textarea id="input" onChange={userInput}></textarea>
      </div>
    </>
  );
}
