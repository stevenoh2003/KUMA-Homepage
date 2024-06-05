import React from "react"
import { RotatingLines } from "react-loader-spinner"

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <RotatingLines
          visible={true}
          height="80"
          width="80"
          color="#4f46e5"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
        <h1>Loading...</h1>
      </div>
    </div>
  )
}

export default LoadingPage
