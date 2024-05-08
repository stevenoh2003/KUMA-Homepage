import { createReactBlockSpec } from "@blocknote/react"
import katex from "katex"
import "katex/dist/katex.min.css" // Ensure KaTeX CSS is loaded

export const LatexBlock = createReactBlockSpec(
  {
    type: "latex",
    content: "inline", // Allows inline editing
    propSchema: {
      latexString: {
        default: "c = \\pm\\sqrt{a^2 + b^2}",
      },
    },
  },
  {
    render: (props) => {
      let latexContent
      try {
        // Render LaTeX string to HTML using KaTeX
        latexContent = katex.renderToString(
          props.block.props.latexString || "",
          {
            throwOnError: false,
          }
        )
      } catch (error) {
        latexContent = `<span class="error">Invalid LaTeX syntax: ${error.message}</span>`
      }

      return (
        <div className={"latex-block"} data-block-type="latex">
          <div
            className={"latex-content"}
            dangerouslySetInnerHTML={{ __html: latexContent }}
          />
          {/* Additional interactive or static elements can be added here */}
        </div>
      )
    },
  }
)
