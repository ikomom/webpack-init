import {log} from "@utils/utils";
import React from 'react'
import ReactDOM from "react-dom";
import Background from "@components/background";

export const name = 'viewport'

log({name})

const App = () => {
  return <Background/>
}

ReactDOM.render(<App/>, document.getElementById('app'))