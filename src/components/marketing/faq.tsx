import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

const FAQ = [
  {
    question: "What is a QR menu?",
    answer: `A QR menu is a restaurant menu that can be read directly on
      the customer's mobile phone by scanning the QR code.`
  },
  {
    question: "How do QR menus work for restaurants?",
    answer: `The restaurant publishes the menu online and creates a QR code that they can place in their business.
      Customers simply scan the QR code with their mobile phone and the menu is displayed
      in their browser.`
  },
  {
    question: "How do I create a QR code for my restaurant menu?",
    answer: `First you need to publish your restaurant menu online, then you can generate a QR code by converting
      the link to your menu into a QR code. With ApsaraMenu you can create your digital menu online, download your QR code and
      use it in your printed materials.`
  },
  {
    question: "Can I update the menu without reprinting the QR code?",
    answer: `Yes, the advantage of a digital menu is that you can edit it at any time without needing to reprint
      or update an image or PDF of your menu.`
  },
  {
    question: "How do I scan a QR code for my menu?",
    answer: `On your Android or iOS device you can simply open the camera app and scan your QR code.
      After this, the menu will be displayed in your browser, just like a normal web page. You don't need to
      download an app to read your menu's QR code.`
  }
]

export default function Faq() {
  return (
    <section id="faq" className="pt-20 pb-28 sm:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:gap-12 sm:px-6 lg:max-w-6xl lg:gap-16">
        <h2 className="font-display text-3xl tracking-tight text-balance text-gray-950 sm:text-4xl dark:text-white">
          Questions and Answers
        </h2>
        <div>
          <Accordion type="single" collapsible>
            {FAQ.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="dark:border-gray-700"
              >
                <AccordionTrigger className="text-start sm:text-lg [&>svg]:text-violet-500 sm:[&>svg]:size-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="col-span-full">
          <p className="text-center">
            Have more questions? Send us an email at{" "}
            <a
              href="mailto:teprithy2020@gmail.com"
              className="text-violet-500 hover:underline"
            >
              teprithy2020@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
