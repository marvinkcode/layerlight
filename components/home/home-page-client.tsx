'use client';

import { cn } from "@/lib/utils";
import { Button } from '@headlessui/react';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ModelViewer from "../product/model-viewer";

export default function HomePageClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorText, setCursorText] = useState("")
  const [isCursorActive, setIsCursorActive] = useState(false)

  const sections = ["home", "design", "experience", "contact"]
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Handle cursor movement
  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Custom cursor */}
      <motion.div
        className={cn(
          "pointer-events-none fixed z-50 flex h-24 w-24 items-center justify-center rounded-full bg-black text-xs font-medium uppercase tracking-wider text-white opacity-0 transition-opacity duration-300",
          isCursorActive && "opacity-100",
        )}
        animate={{
          x: cursorPosition.x - 48,
          y: cursorPosition.y - 48,
          scale: isCursorActive ? 1 : 0.5,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        {cursorText}
      </motion.div>

      {/* Hero Section */}
      <section ref={sectionRefs[0]} className="relative flex h-screen items-center justify-center overflow-hidden">
        {/* 3D Model Background */}
        <div className="absolute inset-0 z-0 bg-gray-100">
          <div className="relative h-full w-full">
            <ModelViewer 
              modelPath="/models/creme/together.stl" 
              initialColor="#f1f1f1"
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/30" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-8xl">SCULPTED LIGHT</h1>
            <p className="mx-auto mb-8 max-w-xl text-xl text-gray-600">
              Transforming spaces through the art of illumination
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">Scroll</span>
            <div className="h-12 w-px bg-gradient-to-b from-gray-500 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Design Section */}
      <section ref={sectionRefs[1]} className="relative min-h-screen bg-white py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-24">
            {/* First product showcase */}
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-gray-500">
                  01 / Helix
                </span>
                <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">Geometric Precision</h2>
                <p className="mb-8 max-w-md text-xl text-gray-600">
                  Mathematical patterns create mesmerizing light forms that transform any space into an immersive
                  experience.
                </p>
                {/* <Button
                  variant="outline"
                  className="rounded-full border-black px-8 py-6 text-sm font-medium uppercase tracking-widest hover:bg-black hover:text-white"
                  onMouseEnter={() => {
                    setIsCursorActive(true)
                    setCursorText("explore")
                  }}
                  onMouseLeave={() => {
                    setIsCursorActive(false)
                    setCursorText("")
                  }}
                >
                  Explore Design
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button> */}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square"
                onMouseEnter={() => {
                  setIsCursorActive(true)
                  setCursorText("view")
                }}
                onMouseLeave={() => {
                  setIsCursorActive(false)
                  setCursorText("")
                }}
              > 
                <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
                  <div className="h-full w-full bg-gradient-to-br from-blue-300 via-purple-400 to-indigo-600 flex items-center justify-center">
                    <div className="w-2/3 h-2/3 bg-gradient-to-tr from-transparent via-white/20 to-white/40 rounded-full transform rotate-45"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Second product showcase */}
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square md:order-1"
                onMouseEnter={() => {
                  setIsCursorActive(true)
                  setCursorText("view")
                }}
                onMouseLeave={() => {
                  setIsCursorActive(false)
                  setCursorText("")
                }}
              >
                <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
                  <div className="h-full w-full bg-gradient-to-r from-pink-300 via-amber-300 to-rose-400 flex items-center justify-center">
                    <div className="w-4/5 h-4/5 bg-gradient-to-bl from-transparent via-white/10 to-white/30 rounded-full transform -rotate-12 blur-sm"></div>
                    <div className="absolute w-1/2 h-1/2 bg-gradient-to-tr from-yellow-200/40 to-transparent rounded-full right-12 top-12 blur-md"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:order-2"
              >
                <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-gray-500">
                  02 / Nebula
                </span>
                <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">Organic Flow</h2>
                <p className="mb-8 max-w-md text-xl text-gray-600">
                  Inspired by natural phenomena, these fluid forms create a sense of movement and ethereal beauty.
                </p>
                {/* <Button
                  variant="outline"
                  className="rounded-full border-black px-8 py-6 text-sm font-medium uppercase tracking-widest hover:bg-black hover:text-white"
                  onMouseEnter={() => {
                    setIsCursorActive(true)
                    setCursorText("explore")
                  }}
                  onMouseLeave={() => {
                    setIsCursorActive(false)
                    setCursorText("")
                  }}
                >
                  Explore Design
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button> */}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Full-screen Video */}
      <section ref={sectionRefs[2]} className="relative h-screen overflow-hidden">
        {/* Full-screen video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src="/placeholder.svg?height=1080&width=1920&text=Experience" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container relative z-10 flex h-full items-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest">The Experience</span>
            <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">Transform Your Space</h2>
            <p className="mb-8 text-xl opacity-90">
              More than just lighting—our designs create atmosphere, emotion, and conversation through the interplay of
              light and shadow.
            </p>
            <Button
              className="rounded-full bg-white px-8 py-6 text-sm font-medium uppercase tracking-widest text-black hover:bg-white/90"
              onMouseEnter={() => {
                setIsCursorActive(true)
                setCursorText("discover")
              }}
              onMouseLeave={() => {
                setIsCursorActive(false)
                setCursorText("")
              }}
            >
              Discover Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={sectionRefs[3]} className="relative min-h-screen bg-white py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-gray-500">
                Contact
              </span>
              <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">Let's Connect</h2>
              <p className="mb-8 max-w-md text-xl text-gray-600">
                Whether you're interested in our collection or want to discuss a custom design, we'd love to hear from
                you.
              </p>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-black outline-none focus:border-black"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-black outline-none focus:border-black"
                    placeholder="Your email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-black outline-none focus:border-black"
                    placeholder="Your message"
                  />
                </div>

                <Button
                  type="submit"
                  className="rounded-full bg-black px-8 py-6 text-sm font-medium uppercase tracking-widest text-white"
                  onMouseEnter={() => {
                    setIsCursorActive(true)
                    setCursorText("send")
                  }}
                  onMouseLeave={() => {
                    setIsCursorActive(false)
                    setCursorText("")
                  }}
                >
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              <Image
                src="/placeholder.svg?height=800&width=800&text=Studio"
                alt="Our Studio"
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
