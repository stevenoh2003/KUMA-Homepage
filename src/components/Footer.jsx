export default () => {
  const footerNavs = [
    // { href: "/", name: "About" },
    { href: "/", name: "Home" },
    { href: "/blog", name: "Blog" },
    { href: "/tutorial", name: "Tutorial" },
    { href: "/events", name: "Events" },
  ];

  return (
    <footer
      className="text-gray-500 px-4 py-32 w-full"
      style={{ backgroundColor: "#f2f3ef" }}
    >
      <div className="max-w-screen-xl mx-auto sm:text-center">
        {/* <img
          src="https://www.floatui.com/logo.svg"
          className="w-32 mx-auto"
          alt="Company Logo"
        /> */}
        {/* <p className="leading-relaxed mt-2 text-[15px]">
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
        </p> */}
        {/* <ul className="flex flex-col items-center justify-center space-y-5 mt-8 sm:flex-row sm:space-x-4 sm:space-y-0">
          {footerNavs.map((item, idx) => (
            <li key={idx} className="hover:text-gray-800">
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul> */}
        <div className="flex flex-col items-center mt-8 sm:flex-row sm:justify-between">
          <div>&copy; 2024 kuma All rights reserved.</div>
          <ul className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Social icons here */}
          </ul>
        </div>
        </div>
      </footer>
  )
}
