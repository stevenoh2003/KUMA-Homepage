import { createReactBlockSpec } from "@blocknote/react"
import { Menu } from "@mantine/core"
import { MdExpandMore } from "react-icons/md" // Icon for the dropdown
import "katex/dist/katex.min.css"
import { InlineMath, BlockMath } from "react-katex"

const latexTypes = [
  {
    title: "Einstein's Energy Formula",
    value: "E = mc^2",
  },
  {
    title: "Quadratic Formula",
    value: "\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",
  },
  {
    title: "Fourier Transform",
    value:
      "\\mathcal{F}(\\omega) = \\int_{-\\infty}^\\infty f(x) e^{-2\\pi ix\\omega} dx",
  },
]

export const LatexBlock = createReactBlockSpec(
  {
    type: "latex",
    propSchema: {
      content: {
        type: "string", // Define content as a string directly if defaultProps.text is undefined
        default: latexTypes[0].value,
      },
      type: {
        default: latexTypes[0].value,
        values: latexTypes.map((latex) => latex.value),
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const latexType =
        latexTypes.find((latex) => latex.value === props.block.props.type) ||
        latexTypes[0]
      const updateLatexType = (newType) => {
        props.editor.updateBlock(props.block, {
          type: "latex",
          props: { ...props.block.props, type: newType, content: newType },
        })
      }

      return (
        <div className="latex-block" data-latex-type={props.block.props.type}>
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className="latex-icon-wrapper" contentEditable={false}>
                <MdExpandMore className="latex-icon" size={32} />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Choose LaTeX Template</Menu.Label>
              <Menu.Divider />
              {latexTypes.map((latex) => (
                <Menu.Item
                  key={latex.value}
                  onClick={() => updateLatexType(latex.value)}
                >
                  {latex.title}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <textarea
            className="latex-content-editable"
            value={props.block.props.content}
            onChange={(e) =>
              props.editor.updateBlock(props.block, {
                type: "latex",
                props: { ...props.block.props, content: e.target.value },
              })
            }
            placeholder="Type or paste LaTeX here..."
          />
          <BlockMath math={props.block.props.content} />
        </div>
      )
    },
  }
)
