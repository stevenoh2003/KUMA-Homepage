import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

const FeatureSection = styled.section`
  padding: 100px 80px;
  background-color: #f2f3ef;
  text-align: center;
`

const FeatureContainer = styled.div`
  max-width: 80%;
  margin: 0 auto;
  text-align: center;
`

const FeatureHeading = styled.h3`
  color: #4f46e5;
  font-weight: 700; /* Make heading more bold */
  font-size: 2rem; /* Increase the size of the heading */
  margin-bottom: 10px;
`

const FeatureTitle = styled.p`
  color: #1f2937;
  font-size: 3rem; /* Increase font size */
  font-weight: 700; /* Make the font weight bolder */
  margin-bottom: 20px;
`

const FeatureDescription = styled.p`
  color: #4b5563;
  font-size: 1.25rem;
  margin-bottom: 40px;

  @media (max-width: 767px) {
    display: none;
  }
`

const FeatureList = styled.ul`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
  justify-content: center; /* Center the items horizontally */
  margin-top: 40px;
  padding: 0;
  list-style: none;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    justify-content: center; /* Center the items horizontally */
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* Ensure it remains three columns */
    justify-content: center; /* Center the items horizontally */
  }
`

const FeatureItem = styled.li`
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, top 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    top: -10px;
  }

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

  opacity: 0;
  transform: translateY(10%);
  transition: opacity 0.6s ease, transform 0.6s ease;

  .description {
    @media (max-width: 767px) {
      display: none;
    }
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid #4f46e5;
  color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center; /* Ensure the icon is centered */
  margin-bottom: 20px;

  svg {
    width: 40px;
    height: 40px;
  }
`

const FeatureHeadingSection = styled.div`
  max-width: 600px;
  margin-bottom: 40px;
  margin: 0 auto;
`

const FeatureSectionComponent = () => {
  const { t } = useTranslation()
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    const elements = ref.current.querySelectorAll(".feature-item")
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-pc-display"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V1Zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0ZM9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5ZM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5ZM1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2H1.5Z" />
        </svg>
      ),
      title: t("features.research.title"),
      desc: t("features.research.desc"),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-translate"
          viewBox="0 0 16 16"
        >
          <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z" />
          <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z" />
        </svg>
      ),
      title: t("features.community.title"),
      desc: t("features.community.desc"),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-award"
          viewBox="0 0 16 16"
        >
          <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z" />
          <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
        </svg>
      ),
      title: t("features.network.title"),
      desc: t("features.network.desc"),
    },
  ]

  return (
    <FeatureSection>
      <FeatureContainer ref={ref}>
        <FeatureHeadingSection>
          <FeatureHeading>{t("features.title")}</FeatureHeading>
          <FeatureTitle>{t("features.growWithUs")}</FeatureTitle>
          {/* <FeatureDescription>{t("features.invitation")}</FeatureDescription> */}
        </FeatureHeadingSection>
        <FeatureList>
          {features.map((item, idx) => (
            <FeatureItem key={idx} className="feature-item">
              <FeatureIcon className="mx-auto">{item.icon}</FeatureIcon>
              <h4 className="my-4 text-lg text-gray-800 font-bold">
                {item.title}
              </h4>
              <p className="description">{item.desc}</p>
            </FeatureItem>
          ))}
        </FeatureList>
      </FeatureContainer>
    </FeatureSection>
  )
}

export default FeatureSectionComponent
