import { ExternalLink } from "lucide-react"
import { useState } from "react"


function Telegramverify() {
    const [loading,setLoading]= useState(false)

    async function getToken (){
        try{

        }catch(error){
            console.log(error)
        }
    }



  function  handleTokenGenerate() {

  }

    
  return (
    <div>
        <h1>Verifying your telegram account</h1>
        <div>
            <h1>Before you start</h1>
            <p>Make sure you have Telegram installed [Windows/Playstore]</p>
           
            <div>
                <h1>Click the link below</h1>
                <a target="_blank" rel="noopener noreferrer" href='https://t.me/No_Ti_Fi_Ca_Ti_OnBot' className='text-xs mt-2 max-w-fit flex justify-center hover:border-b-2 border-blue-400 items-center font-semibold uppercase '>Connect to our telegram bot  <ExternalLink className='ml-2 h-4 w-4' strokeWidth={1.5}/> </a>
                <p>Open the chat and type /start</p>
                <p>You should get a welcome message, which means the bot is working</p>
            </div>
           
                <div>
                    <h1>Connecting Your email with telegram</h1>

                    <div>
                        <p>Generate a unique token</p>
                        {loading && <p>Generating you token..please wait</p>}
                        <button onClick={handleTokenGenerate}  className="border-1">Generate</button>
                    </div>

                </div>
        </div>
    </div>
  )
}

export default Telegramverify