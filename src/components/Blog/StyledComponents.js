import styled from 'styled-components';

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px; // Space between buttons
  margin-bottom: 20px; // Space between the two rows
`

export const StyledButton = styled.button`
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

  &.is-active {
    background-color: #4f46e5;
    color: white
  }

  &:disabled {
    background-color: #f9f9f9;
    color: #ccc;
    cursor: not-allowed;
  }
`
export const StyledEditor = styled.div`
  width: 70%;
  margin: auto;

  @media (max-width: 768px) {
    width: 100%; // Adjusted to 90% for small screens
  }

  @media (max-width: 480px) {
    width: 100%; // Further reduce width for very small screens (optional)
  }

  .ProseMirror {
    border-radius: 5px;
    padding: 20px;
    line-height: 1.8;
    font-size: 17px;
    font: "Fira Sans", sans-serif;
  }

  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding-left: 1.5rem; /* Indent the lists */
  }

  ul {
    list-style-type: disc; /* Default bullet points */
  }

  ol {
    list-style-type: decimal; /* Numbered list */
  }

  li {
    margin-bottom: 0.5em; /* Add space between each list item */
  }

  h1 {
    font-size: calc(1.5rem + 1vw); /* Largest, for main titles */
    line-height: 1.2;
  }

  h2 {
    font-size: calc(
      1.375rem + 0.8vw
    ); /* Second largest, for major section headings */
    line-height: 1.3;
  }

  h3 {
    font-size: calc(1.25rem + 0.6vw); /* Medium size, for sub-sections */
    line-height: 1.35;
  }

  h4 {
    font-size: calc(1.125rem + 0.6vw); /* Smaller than h3 */
    line-height: 1.4;
  }

  h5 {
    font-size: calc(
      1rem + 0.3vw
    ); /* Smaller, often used for sub-sub-headings */
    line-height: 1.45;
  }

  h6 {
    font-size: calc(
      0.875rem + 0.2vw
    ); /* Smallest, for least important headings */
    line-height: 1.5;
  }

  code,
  pre {
    background-color: rgba(97, 97, 97, 0.1);
    color: #616161;
  }

  pre {
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(13, 13, 13, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(13, 13, 13, 0.1);
    margin: 2rem 0;
  }
`
