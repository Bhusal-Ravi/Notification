import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0,x:-30 }}
      animate={{ opacity: 1,x:0 }}
      exit={{ opacity: 0,x:-10 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="relative border-4 border-black px-12 py-10 shadow-[14px_14px_0px_0px_black] bg-white">
        
        {/* Yellow Accent Block */}
        <div className="absolute -top-4 -left-4 w-6 h-6 bg-yellow-400 border-4 border-black" />
        
        <h1 className="text-3xl font-black tracking-tight uppercase mb-2">
          Loading
        </h1>
        <DotLottieReact
      src="animations/loadinganimation.lottie"
      loop
      autoplay
    />
      </div>
        
    </motion.div>
  );
}
