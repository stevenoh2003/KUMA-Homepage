import React, { useState } from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

// Sample images with translation keys for descriptions
const images = [
  {
    src: "gallery/cointbot.jpg",
    descriptionKey: "cointbot",
  },
  {
    src: "gallery/mane.jpeg",
    descriptionKey: "mimicRobot",
  },
  {
    src: "gallery/diffusion.png",
    descriptionKey: "diffusion",
  },
  {
    src: "gallery/tart.png",
    descriptionKey: "tart",
  },
  {
    src: "gallery/robot_twin.jpg",
    descriptionKey: "robotTwin",
  },
  {
    src: "gallery/robot_drawing.jpeg",
    descriptionKey: "robotDrawing",
  },
  {
    src: "gallery/realsense.jpg",
    descriptionKey: "realsense",
  },
  {
    src: "gallery/LLM.png",
    descriptionKey: "llm",
  },
]

const GallerySection = styled.section`
  padding: 0px 40px 100px 40px;
  background-color: #f2f3ef;
  text-align: center;
`

const GalleryContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  text-align: center;

  @media (min-width: 624px) {
    max-width: 70%; /* Take 60% of the width on large screens */
  }
`

const GalleryHeading = styled.h3`
  color: #4f46e5;
  font-weight: 700; /* Make heading more bold */
  font-size: 2rem; /* Increase the size of the heading */
  margin-bottom: 10px;

  @media (max-width: 767px) {
    font-size: 1.5rem; /* Adjust the size of the heading for small screens */
  }
`

const GalleryTitle = styled.p`
  color: #1f2937;
  font-size: 3rem; /* Increase font size */
  font-weight: 700; /* Make the font weight bolder */
  margin-bottom: 20px;

  @media (max-width: 767px) {
    font-size: 1.5rem; /* Adjust the size of the title for small screens */
  }

  @media (max-width: 480px) {
    font-size: 1.5rem; /* Adjust the size of the title for extra small screens */
  }
`

const Container = styled.div`
  width: 90%;
  margin: auto;
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
  const { t } = useTranslation()

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
    <GallerySection>
      <GalleryContainer>
        <GalleryHeading>{t("gallery")}</GalleryHeading>
        <GalleryTitle>{t("communityProjects")}</GalleryTitle>
      </GalleryContainer>
      <Container>
        {images.map((image, index) => (
          <ImageWrapper key={index} onClick={() => handleImageClick(index)}>
            <Image src={image.src} alt={`Image ${index + 1}`} />
            <Overlay className="Overlay">
              {t(`descriptions.${image.descriptionKey}`)}
            </Overlay>
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
              {t(`descriptions.${images[currentSlide].descriptionKey}`)}
            </Overlay>
          )}
        </SlideWrapper>
        <NextArrow onClick={nextSlide}>&#9654;</NextArrow>
      </SlideshowContainer>
    </GallerySection>
  )
}

export default ImageGallery
