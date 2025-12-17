import { CornerRightUp, Rocket, ShoppingBag, Store } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import Features from "@/components/flare-ui/features-horizontal"
import FlickeringGrid from "@/components/flare-ui/flickering-grid"
import TitleSection from "@/components/marketing/title-section"
import QRimage from "../../../public/qr-example.png"

const data = [
  {
    id: 1,
    title: "1. Set up your business",
    content:
      "Add your business information, hours of operation, and social media. Our system will take care of everything else.",
    image: "/configuration.png",
    icon: <Store className="size-6" />
  },
  {
    id: 2,
    title: "2. List your products",
    content:
      "Add your products, include a brief description, price, and you'll be ready to create your menu.",
    image: "/products.png",
    icon: <ShoppingBag className="size-6" />
  },
  {
    id: 3,
    title: "3. Launch your menu",
    content:
      "Customize your menu with the web editor, publish it, and share the link and QR code with your customers. It's that easy!",
    image: "/editor.png",
    icon: <Rocket className="size-6" />
  }
]

export default function Component() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-5xl px-4 pt-20 pb-8 sm:px-6 sm:py-32 sm:pb-28 lg:max-w-7xl lg:px-8"
    >
      <TitleSection
        eyebrow="How it works"
        title="Just 3 steps to get started"
        className="mb-16"
      />
      <Features collapseDelay={6000} data={data} linePosition="bottom" />
      <div className="mx-auto mt-0 grid max-w-5xl grid-cols-1 gap-8 px-4 sm:mt-28 sm:grid-cols-2 sm:px-0">
        <div>
          <h3 className="mb-4 text-lg font-semibold sm:text-2xl lg:text-3xl">
            Generate and download your QR code
          </h3>
          <div className="flex flex-col gap-3 text-gray-500 sm:text-lg">
            <p>
              From the ApsaraMenu editor, you can download your QR code. Print
              it and place it in a visible location in your establishment.
            </p>
            <p>
              Your customers will be able to scan the QR code with their mobile
              phone and access your digital menu.{" "}
              <span className="text-gray-900">
                You can share your menu link on social media
              </span>{" "}
              or on your website.
            </p>
            <p>
              ApsaraMenu digital menus are responsive and adapt to any mobile
              device. They are easy to read and navigate, and you don&apos;t
              need to install any additional applications.
            </p>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center gap-3 overflow-hidden">
          <FlickeringGrid
            className="absolute inset-0 z-0 hidden size-full sm:block"
            squareSize={4}
            gridGap={6}
            color="#d4d4d8"
            maxOpacity={0.5}
            flickerChance={0.05}
            height={500}
            width={500}
          />
          <Link href="https://biztro.co/la-bella-italia" className="z-10">
            <Image
              src={QRimage}
              alt="Sample QR code"
              className="rounded-lg shadow-xl"
              width={300}
              height={300}
            />
          </Link>
          <span className="z-10 flex gap-2 text-gray-600 text-shadow-white">
            Scan to see an{" "}
            <Link
              href="https://biztro.co/la-bella-italia"
              className="underline underline-offset-2 hover:text-violet-500"
            >
              example
            </Link>
            <CornerRightUp className="size-4" />
          </span>
        </div>
      </div>
    </section>
  )
}
