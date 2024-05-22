import React from "react"
import { NotionAPI } from "notion-client"
import dynamic from "next/dynamic"
import { NotionRenderer } from "react-notion-x"
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
)
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

export async function getStaticProps() {
  const notion = new NotionAPI()
  const recordMap = await notion.getPage(
    "FSRCNN-29adb81ef2f444c08daba452fcfbd1bc"
  )

  return {
    props: {
      recordMap,
    },
  }
}

const Index = ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    components={{
      Code,
      Collection,
      Equation,
      Modal,
      Pdf,
    }}
  />
)

export default Index
