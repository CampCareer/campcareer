"use client"

import dynamic from "next/dynamic"

export default dynamic(() => import("./no-map-v2"), {
  ssr: false,
  loading: () => <div className="min-h-screen animate-pulse bg-slate-100" />,
})
