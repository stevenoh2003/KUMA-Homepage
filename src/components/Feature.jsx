import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline"

const features = [
  {
    name: "Community Blog",
    description:
      "Explore the latest in robotics with insights from enthusiasts and experts. Share and discover projects and stories to inspire innovation.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Tutorial",
    description:
      "Unlock the world of robotics, from basics for beginners to complex projects for advanced builders. Your guide to integrating software with hardware.",
    icon: LockClosedIcon,
  },
  {
    name: "Robotics Events",
    description:
      "Discover and engage in robotics events, from local meetups to international competitions. Showcase your projects and connect with the community.",
    icon: ArrowPathIcon,
  },
  {
    name: "Educational Outreach",
    description:
      "Advancing robotics knowledge through partnerships with educational institutions. Access resources and programs to inspire future innovators.",
    icon: FingerPrintIcon,
  },
]

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Deploy faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to deploy your app
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Stay informed about the latest robotics competitions, meetups, and
            conferences worldwide. Connect with peers, showcase your
            innovations, and find inspiration.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}