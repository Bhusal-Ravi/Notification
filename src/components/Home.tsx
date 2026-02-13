import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  MessageCircle,
  Clock,
  Globe,
  Flame,
  ArrowRight,
  Quote,
} from "lucide-react";
import { authClient } from "../../lib/auth-client";
import Login from "./Login";

export default function Home() {
  const { data: session } = authClient.useSession();

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Your Habits,
            <br />
            <span className="inline-block bg-[#FFFF00] px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
              On Autopilot.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          A multi-channel notification system that reminds you to drink water,
          exercise, study and sends you a daily summary email at midnight.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="mt-8"
        >
          {session ? (
            <Link to="/main" className="inline-block">
              <div className="rounded-md bg-black">
                <span className="bg-[#FFFF00] inline-flex items-center gap-2 rounded-md border-2 border-black px-6 py-3 font-bold -translate-x-1 -translate-y-1 transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0">
                  Get Started <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          ) : (
            <Login />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="mt-12"
        >
          <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
            <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
              Dashboard Preview
            </span>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black mb-12"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6 transition-all hover:-translate-y-1"
          >
            <div className="bg-[#ffff00] w-10 h-10 rounded-md border-2 border-black flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <ArrowRight className="w-6 h-6 mb-3" />
            <h3 className="font-bold text-lg mb-1">Sign In</h3>
            <p className="text-sm leading-relaxed">
              Log in with your Google account in one click.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6 transition-all hover:-translate-y-1"
          >
            <div className="bg-[#4ecdc4] w-10 h-10 rounded-md border-2 border-black flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <MessageCircle className="w-6 h-6 mb-3" />
            <h3 className="font-bold text-lg mb-1">Connect Telegram</h3>
            <p className="text-sm leading-relaxed">
              Link your Telegram using /activateNotify and choose your tasks.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6 transition-all hover:-translate-y-1"
          >
            <div className="bg-[#ff6b6b] w-10 h-10 rounded-md border-2 border-black flex items-center justify-center font-black text-white text-lg mb-4">
              3
            </div>
            <Bell className="w-6 h-6 mb-3" />
            <h3 className="font-bold text-lg mb-1">Get Reminded</h3>
            <p className="text-sm leading-relaxed">
              Receive smart reminders on Telegram at intervals you control.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6 transition-all hover:-translate-y-1"
          >
            <div className="bg-[#a78bfa] w-10 h-10 rounded-md border-2 border-black flex items-center justify-center font-black text-white text-lg mb-4">
              4
            </div>
            <Mail className="w-6 h-6 mb-3" />
            <h3 className="font-bold text-lg mb-1">Track & Review</h3>
            <p className="text-sm leading-relaxed">
              See your streaks on the dashboard and get a midnight email digest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black mb-12"
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Telegram Reminders Screenshot
              </span>
            </div>
            <div className="p-5 border-t-4 border-[#ffff00]">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-bold text-lg">Telegram Reminders</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Human-sounding reminders for water, exercise, and study sessions
                sent right to your Telegram.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Midnight Email Digest Screenshot
              </span>
            </div>
            <div className="p-5 border-t-4 border-[#4ecdc4]">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5" />
                <h3 className="font-bold text-lg">Midnight Email Digest</h3>
              </div>
              <p className="text-sm leading-relaxed">
                A branded email summary of your day's completed tasks, delivered
                at midnight.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Quote of the Day Screenshot
              </span>
            </div>
            <div className="p-5 border-t-4 border-[#ff6b6b]">
              <div className="flex items-center gap-2 mb-2">
                <Quote className="w-5 h-5" />
                <h3 className="font-bold text-lg">Quote of the Day</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Start your morning with an inspiring quote at 6 AM, straight to
                Telegram.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Custom Cadence Screenshot
              </span>
            </div>
            <div className="p-5 border-t-4 border-[#a78bfa]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-lg">Custom Cadence</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Set notification intervals (every 15 min, every 2 hours) or
                fixed times per task.
              </p>
            </div>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Timezone Aware Screenshot
              </span>
            </div>
            <div className="p-5 border-t-4 border-[#ffff00]">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5" />
                <h3 className="font-bold text-lg">Timezone Aware</h3>
              </div>
              <p className="text-sm leading-relaxed">
                All notifications respect your local timezone. No 3 AM surprises.
              </p>
            </div>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Daily Streaks Screenshot
              </span>
            </div>
            <div className="p-5 border-t-4 border-[#4ecdc4]">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" />
                <h3 className="font-bold text-lg">Daily Streaks</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Track your consistency with real-time streak counters on the
                dashboard.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCREENSHOT GALLERY */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black mb-12"
        >
          Preview
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
            className="border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden bg-white transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video rounded-none">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Dashboard — Subscription Cards
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden bg-white transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video rounded-none">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Update Center — Cadence Settings
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden bg-white transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-gray-200 aspect-video rounded-none">
              <span className="text-gray-400 font-bold text-sm md:text-base text-center px-4">
                Telegram Bot — Conversation Preview
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="bg-[#FFFF00] border-2 border-black rounded-lg shadow-[8px_8px_0px_0px_#000] p-10 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Ready to automate your habits?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Sign up in seconds and start getting reminders that actually stick.
          </p>
          {session ? (
            <Link to="/main" className="inline-block">
              <div className="rounded-md bg-black">
                <span className="bg-white inline-flex items-center gap-2 rounded-md border-2 border-black px-6 py-3 font-bold -translate-x-1 -translate-y-1 transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0">
                  Get Started <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          ) : (
            <Login />
          )}
        </motion.div>
      </section>
    </div>
  );
}