import React, {Suspense} from "react";
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
      啊啊啊 zxzxzx
      <Suspense fallback={"loading..."}>
        <RemoteApp/>
      </Suspense>
    </div>)
}


export default App;
