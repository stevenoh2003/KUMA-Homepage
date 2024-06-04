import React, { useState } from "react"
import styled from "styled-components"

// Sample images with descriptions
const images = [
  {
    src: "gallery/cointbot.jpg",
    description:
      "Coinbot leverages computer vision to pick up nearby coins and analyzes your saving patterns.",
  },
  {
    src: "gallery/mane.jpeg",
    description:
      "The Mimic Robot (真似っ子ロボット) imitates your movements when you interact with others.",
  },
  {
    src: "gallery/diffusion.png",
    description:
      "A visualization showcasing the capabilities of a state-of-the-art diffusion model.",
  },
  {
    src: "gallery/tart.png",
    description:
      "An intelligent retail trolley prototype that uses path-planning algorithms to follow you around the supermarket.",
  },
  {
    src: "gallery/robot_twin.jpg",
    description:
      "Developing a digital twin of a dexterous robot arm using ROS and MoveIt.",
  },
  {
    src: "gallery/robot_drawing.jpeg",
    description:
      "A research project exploring the ability of robots to draw using state-of-the-art stroke generation algorithms to sketch images in pencil.",
  },
  {
    src: "gallery/realsense.jpg",
    description:
      "Experimenting with the RealSense camera to produce depth-enhanced image data.",
  },
  {
    src: "gallery/LLM.png",
    description:
      "Training a cutting-edge Large Language Model (LLM) from scratch!",
  },
]


const Container = styled.div`
  margin-top: 60px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 1fr;
  }

  @media (max-width: 767px) {
    display: none;
  }
`

const SlideshowContainer = styled.div`
  margin: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    display: none;
  }
`

const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px; /* You can adjust this value */
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }

  &:hover .Overlay {
    opacity: 1;
    transform: translateY(0);
  }
`

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
`

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`

const PrevArrow = styled(Arrow)`
  left: 10px;
`

const NextArrow = styled(Arrow)`
  right: 10px;
`

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }

  &:hover .Overlay {
    opacity: 1;
    transform: translateY(0);
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  aspect-ratio: 1 / 1;
`

const Overlay = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(10%);
`

const ImageGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)

  const handleImageClick = (index) => {
    console.log(`Image ${index} clicked`)
    // Implement navigation to another page
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setShowOverlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setShowOverlay(false)
  }

  const handleSlideClick = () => {
    setShowOverlay((prev) => !prev)
  }

  return (
    <>
      <Container>
        {images.map((image, index) => (
          <ImageWrapper key={index} onClick={() => handleImageClick(index)}>
            <Image src={image.src} alt={`Image ${index + 1}`} />
            <Overlay className="Overlay">{image.description}</Overlay>
          </ImageWrapper>
        ))}
      </Container>
      <SlideshowContainer>
        <PrevArrow onClick={prevSlide}>&#9664;</PrevArrow>
        <SlideWrapper onClick={handleSlideClick}>
          <SlideImage
            src={images[currentSlide].src}
            alt={`Slide ${currentSlide + 1}`}
          />
          {showOverlay && (
            <Overlay className="Overlay">
              {images[currentSlide].description}
            </Overlay>
          )}
        </SlideWrapper>
        <NextArrow onClick={nextSlide}>&#9654;</NextArrow>
      </SlideshowContainer>
    </>
  )
}

export default ImageGallery