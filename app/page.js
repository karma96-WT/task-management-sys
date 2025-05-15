import Image from "next/image";
import Link from "next/link";
import './local.css';
export default function Home() {
  return (
    <div className="body-div">
      <Link href={'/login'} className="login">Login</Link>
      <Link href={'/register'} className="register">Register</Link>
    </div>
  );
}
