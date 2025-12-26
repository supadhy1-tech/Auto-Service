import { Link } from 'react-router-dom';
import AboutUs from '../components/AboutUs.jsx';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1 style={{ color:'white'}}>Reliable Auto Care in Your City</h1>
        <p>From oil changes to brake repair, we keep your car running smoothly.</p>
        <Link to="/book"><button className="primary">Book an Appointment</button></Link>
      </section>
      <h2 style={{marginTop:32}}>Why choose us</h2>
      <div className="grid">
        <div className="card"><b>Certified Mechanics</b><p>ASE-certified techs with years of experience.</p></div>
        <div className="card"><b>Fair Pricing</b><p>Transparent quotes before any work begins.</p></div>
        <div className="card"><b>Fast Turnaround</b><p>Same-day service available for many jobs.</p></div>
      </div>
      <AboutUs/>
    </div>
  )
}
