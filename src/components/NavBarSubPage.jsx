import React from 'react'

const NavBarSubPage = () => {
  return (
    <nav
      className="bg-transparent w-full border-b md:border-0 md:static py-10"
      style={{ backgroundColor: "#f2f3ef" }}
    >
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-10 md:space-y-0">
            {navigation.map((item, idx) => {
              return (
                <li key={idx} className="text-gray-600 hover:text-indigo-600">
                  <a href={item.path}>{item.title}</a>
                </li>
              )
            })}
          </ul>
        </div>

      </div>
    </nav>
  )
}

export default NavBarSubPage