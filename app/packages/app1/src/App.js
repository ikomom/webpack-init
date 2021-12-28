import React, {Suspense, useEffect, useState} from "react";
import {name, version} from 'app3'
import ErrPage from "./ErrPage";

const RemoteApp = (
  {
    fallback = 'loading',
    importFunction = () => Promise.reject("未设置导入地址"),
    errorFallback = ErrPage
  }) => {
  const [app, setApp] = useState(null)

  useEffect(() => {
    setApp(React.lazy(() =>
      new Promise(resolve => {
        importFunction().then(res => {
          if (res) {
            console.log('RemoteApp:imported', res, fallback)
            resolve(res)
            return;
          }
          throw 'undefined res'
        }).catch(err => {
          console.error('RemoteApp:error', err)
          resolve({default: errorFallback})
        })
      }))
    );
  }, [])

  return app ? (
    <Suspense fallback={fallback}>{React.createElement(app, null)}</Suspense>
  ) : null
}

const app2 = () => import(`app2/App`)
const app3 = () => import(`./Page2`)

const App = () => {
  return (
    <div>
      <div style={{
        margin: "1px",
        padding: "110px",
        textAlign: "center",
        backgroundColor: "greenyellow"
      }}>
        <h1>App1</h1>
      </div>
      啊啊啊 zxzxzx {name} {version}
      <RemoteApp importFunction={app2}/>
      <RemoteApp importFunction={app3} fallback={'kkkk'} errorFallback={() => <div style={{background: 'blue', color: 'red'}}>gg</div>}/>
    </div>)
}


export default App;
