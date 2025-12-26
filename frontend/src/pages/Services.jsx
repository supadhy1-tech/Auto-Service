const services = [
  { name: 'Oil Change', desc: 'Conventional or synthetic oil + filter' },
  { name: 'Brake Service', desc: 'Pads, rotors, inspection' },
  { name: 'Tire Rotation', desc: 'Even wear and longer tire life' },
  { name: 'Battery Replacement', desc: 'Testing, install, recycling' },
  { name: 'Engine Diagnostics', desc: 'OBD-II scan, full report' },
];

export default function Services() {
  return (
    <div>
      <h1>Services</h1>
      <div className="grid">
        {services.map(s => (
          <div key={s.name} className="card">
            <b>{s.name}</b>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
