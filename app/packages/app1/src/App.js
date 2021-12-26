import React, {Suspense} from "react";
import {name, version} from 'app3'
const RemoteApp = React.lazy(() => import("app2/App"));

const App = () => {
  return (
    <div>
      <div style={{
        margin:"1px",
        padding:"110px",
        textAlign:"center",
        backgroundColor:"greenyellow"
      }}>
        <h1>App1</h1>
      </div>
      啊啊啊 zxzxzx {name} {version}
      <Suspense fallback={"loading..."}>
        <RemoteApp/>
      </Suspense>
    </div>)
}


export default App;
