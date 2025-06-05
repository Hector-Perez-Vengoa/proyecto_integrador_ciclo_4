import { Link } from "react-router"

const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" />
        </div>
        <button type="submit">Login</button>
        <Link to="/dashboard" className="ml-4 text-blue-500 hover:underline">
          Ir al Dashboard
        </Link>
      </form>
    </div>
  )
}

export default Login
