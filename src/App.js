import React from 'react';
import './App.css';
import Amplify, { Auth, Storage } from 'aws-amplify';

Amplify.configure({
  Auth: {
      identityPoolId: process.env.REACT_APP_identityPoolId, //REQUIRED - Amazon Cognito Identity Pool ID
      region: process.env.REACT_APP_region, // REQUIRED - Amazon Cognito Region
      userPoolId: process.env.REACT_APP_userPoolId, //OPTIONAL - Amazon Cognito User Pool ID
      userPoolWebClientId: process.env.REACT_APP_userPoolWebClientId, //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
      AWSS3: {
          bucket: process.env.REACT_APP_bucket, //REQUIRED -  Amazon S3 bucket,
          region: process.env.REACT_APP_region, //OPTIONAL -  Amazon service region
      }
  }
});

function App() {

  const [fileList, setFileList] = React.useState([])

  const getFileList = async () => {
    const responseList =  await Storage.list('file/')
    setFileList(responseList)
    return responseList
  }

  React.useEffect(() => {
    const init = async () => {
      // const check = await Auth.currentSession()
      // console.log("CHECK", check)
      // const login = check || await Auth.federatedSignIn() 
      // console.log("LOGIN", login)
      // const list = login && await getFileList()
      const list = await getFileList()
      console.log("LIST", list)
    }

    init()
  }, [])

  return (
    <div className="App">
      <div className="add">
        <label htmlFor="upload-file">
          <span className="control">Upload Folder</span>
          <input 
            type="file" 
            className="upload" 
            id="upload-file" 
            webkitdirectory="" 
            mozdirectory=""
            onChange={e => {
              Array.from(e.target.files).forEach(async file => { 
                console.log(file)
                const puts = await Storage.put(`file/${file.webkitRelativePath}`, file)
                console.log("PUTS", puts)
                getFileList()
               });
            }}
          />
        </label>
      </div>

      <div className="list">
        {
          fileList.map(file => {
            const type = file.size === 0 ? "Folder" : ""
            return <div key={file.key}>
              {
                type === 'Folder' && (
                  <div>
                    <strong>{file.key}</strong>
                  </div>
                )
              }
              {
                type !== "Folder" && (
                  <div className="file">
                    {file.key}
                  </div>
                )
              }
            </div>
          })
        }
      </div>
    </div>
  );
}

export default App;
