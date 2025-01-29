import { businesses } from '~/const'
import { Link, Outlet } from 'react-router'

export default function LandingLayout() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="h-20 z-[1] px-10 fixed flex text-white items-center justify-between w-full">
        <nav className="flex flex-grow basis-0">
          <Link to="/login" className="flex items-center gap-1">
            <img src="_lp-only-logo.webp" className="" width={25} alt="" />
            <img
              src="_lp_only-letters.webp"
              className="invert grayscale"
              width={70}
              alt=""
            />
          </Link>
        </nav>
        <nav className="hidden lg:flex items-center gap-10">
          {Object.entries(businesses).map(([url, { acronym, logo, name }]) => (
            <Link
              title={'Ir a la página de ' + name}
              key={url}
              to={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                className="w-[100%] invert hover:invert-0 group-hover:scale-105 grayscale group-hover:grayscale-0 md:h-[25px] h-[15px]"
                src={logo}
                loading="lazy"
                alt={acronym + ' Logo' + name}
              />
            </Link>
          ))}
        </nav>
        <nav className="flex flex-grow basis-0 justify-end"></nav>
      </header>
      <Outlet />
    </div>
  )
}
