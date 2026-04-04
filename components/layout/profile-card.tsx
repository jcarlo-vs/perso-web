"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { personalInfo } from "@/lib/portfolio-data";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";

export function ProfileCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="fixed left-[max(2rem,calc((100vw-1600px)/2+2rem))] top-1/2 -translate-y-1/2 z-50 hidden xl:block"
    >
      {/* Main card - clean glass effect */}
      <div className="relative flex flex-col items-center gap-5 px-10 py-10 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/40 shadow-xl min-w-[280px]">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full" />

        {/* Name */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base font-light uppercase tracking-[0.2em] text-center text-slate-300"
        >
          {personalInfo.name}
        </motion.h3>

        {/* Profile Image - subtle ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="relative"
        >
          {/* Simple gradient ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-500/30 via-purple-400/15 to-purple-500/10" />

          {/* Image container */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-slate-800">
            <Image
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-1.5"
        >
          <div className="relative inline-block">
            <p className="font-medium text-xs tracking-[0.12em] text-white/90">
              {personalInfo.title.toUpperCase()}
            </p>
            <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
          </div>
          <p className="text-xs text-slate-500">{personalInfo.email}</p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 mt-1"
        >
          {[
            {
              href: personalInfo.social.linkedin,
              icon: FaLinkedin,
              color: "hover:text-white hover:border-white/30",
            },
            {
              href: personalInfo.social.github,
              icon: FaGithub,
              color: "hover:text-white hover:border-white/30",
            },
          ].map((social, index) => (
            <Link
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full border border-slate-700/60 bg-slate-800/30 text-slate-500 transition-colors duration-200 ${social.color}`}
              >
                <social.icon className="w-4 h-4" />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Download CV Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="mt-1 flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-medium tracking-wider text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all duration-200 cursor-pointer"
          onClick={() => {
            console.log("download cv");
          }}
        >
          <HiDownload className="w-3.5 h-3.5" />
          DOWNLOAD CV
        </motion.button>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-[10px] text-slate-600 text-center mt-1"
        >
          {personalInfo.copyright}
        </motion.p>
      </div>
    </motion.aside>
  );
}
