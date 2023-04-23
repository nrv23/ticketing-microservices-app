import Link from 'next/link';

export default ({currentUser}) => {

    const links = [
        !currentUser && {label: "Sign Up", href: "/auth/signup"},
        !currentUser && {label: "Sign In", href: "/auth/signin"},
        currentUser &&{label: "Sign Out", href: "/auth/signout"},
        currentUser &&{label: "Sell Tickets", href: "/tickets/new"},
        currentUser &&{label: "My Orders", href: "/orders"},
    ]
        .filter(linkConfig => linkConfig)
        .map(({href, label}) => {
            return <li key={href} className="nav-item">
                <Link href={href}>
                    <a href="" className="nav-link">{label}</a>
                </Link>
            </li>
        })

    return <nav className="navbar navbar-light bg-light">
        <Link href="/">
            <a href="" className="navbar-brand">GitTix</a>
        </Link>

        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
}