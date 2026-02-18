import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

function Pagenotfound() {
      const navigate = useNavigate();
  return (
    <div
    className='flex min-h-screen flex-col   justify-center items-center mx-10'>
    <DotLottieReact
      src="/animations/404notfound.lottie"
      loop
      autoplay
    />

    <button
              onClick={() => navigate("/")}
              className="  rounded-xl border-4 border-black bg-[#7df9ff] px-5 py-3 text-lg font-bold uppercase tracking-wide transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              Go to Home
            </button>
    </div>
 
  )
}

export default Pagenotfound