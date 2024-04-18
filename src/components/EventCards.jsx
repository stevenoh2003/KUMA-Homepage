import { useState } from "react"

const members = [
  {
    company_icon: (
      <svg
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path d="M41 0H11a1 1 0 0 0-1 1v3H7a1 1 0 0 0-1 1v42a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm-5 46H8V6h20v7a1 1 0 0 0 1 1h7zM30 7.41 34.59 12H30zM40 42h-2c0-31 .14-29.28-.29-29.71C29.08 3.66 29.61 4 29.06 4H12V2h28z" />
        <path d="M32 22H12a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2zM32 17H12a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2zM32 27H12a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2zM32 32H12a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2zM22 37H12a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2z" />
      </svg>
    ),
    company_name: "TBD",
    job_title: "Paper Reading Session",
    job_description:
      "We will gather together to discuss an academic paper chosen by our members.",
    job_type: "Full-time",
    location: "Remotely",
    path: "javascript:void(0)",
  },
  {
    company_icon: (
      <svg
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-gear"
        viewBox="0 0 16 16"
      >
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
      </svg>
    ),
    company_name: "TBD",
    job_title: "In-house hackathon",
    job_description:
      "We will compete with each other through creating tech projects. ",
    job_type: "Full-time",
    location: "Remotely",
    path: "javascript:void(0)",
  },
]

const itemsPerPage = 10 // Number of items per page

const Pagination = ({ total, itemsPerPage, currentPage, onPageChange }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(total / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center space-x-2 mt-8">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 border rounded ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  )
}

export default () => {
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <section className="py-28">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8">
        <div className="max-w-md">
          <h1 className="text-gray-800 text-2xl font-extrabold sm:text-3xl">
            Upcomoing events
          </h1>
          <p className="text-gray-600 mt-2">
            Be part of our events and let's grow togther!
          </p>
        </div>
        <ul className="mt-12 divide-y space-y-3">
          {currentItems.map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-5 duration-150 hover:border-white hover:rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              <a href={item.path} className="space-y-3">
                <div className="flex items-center gap-x-3">
                  <div className="bg-white w-14 h-14 border rounded-full flex items-center justify-center">
                    {item.company_icon}
                  </div>
                  <div>
                    <span className="block text-sm text-indigo-600 font-medium">
                      {item.company_name}
                    </span>
                    <h3 className="text-base text-gray-800 font-semibold mt-1">
                      {item.job_title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 sm:text-sm">
                  {item.job_description}
                </p>
                {/* <div className="text-sm text-gray-600 flex items-center gap-6">
                  <span>{item.job_type}</span>
                  <span>{item.location}</span>
                </div> */}
              </a>
            </li>
          ))}
        </ul>
        <Pagination
          total={members.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  )
}
