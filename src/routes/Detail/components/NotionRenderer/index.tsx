import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"
import Script from "next/script"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import React, { useEffect } from "react"

import styled from "@emotion/styled"


const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) =>  m.Code )
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("./Equation").then((m) => m.Equation)
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

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()

  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={false}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
      <Script
        src="https://utteranc.es/client.js"
        strategy="afterInteractive"
        {...{
          repo: "stevenoh2003/KUMA-Homepage",
          "issue-term": "pathname",
          label: "blog",
          theme: "github-light",
          crossorigin: "anonymous",
          async: "",
        }}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  /* // TODO: why render? */

  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-equation-block {
    display: block; /* Ensure block-level display */
    text-align: center; /* Center content */
    width: 100%; /* Take full width to allow centering */
  }
  .notion-equation-inline .katex-display,
  .notion-equation-inline .katex {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .utterances {
    margin-top: 2rem !important; /* Increase top margin */
    margin-bottom: 2rem !important; /* Increase bottom margin */
  }

  .utterances-frame {
    margin-top: 2rem !important; /* Optional: in case the iframe itself needs adjustment */
    margin-bottom: 2rem !important; /* Optional: in case the iframe itself needs adjustment */
  }
`
