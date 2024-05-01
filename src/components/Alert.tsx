// src/components/LaTeXBlock.js
import { createReactBlockSpec } from "@blocknote/react";
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const Alert = createReactBlockSpec(
  {
    type: "latex",
    propSchema: {},
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <div style={{ textAlign: "center" }}>
          <BlockMath math={props.block.text || 'c = \\pm\\sqrt{a^2 + b^2}'} />
        </div>
      );
    },
  }
);
