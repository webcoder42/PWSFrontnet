const Stats = () => {
  const stats = [
    { value: '10,000+', label: 'Happy Clients' },
    { value: '5,000+', label: 'Active Jobs' },
    { value: '4.8/5', label: 'Client Rating' },
    { value: '98%', label: 'Match Success Rate' },
  ];

  return (
    <section className="bg-primary-dark text-white py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-bold">{stat.value}</h3>
              <p className="text-white/60 uppercase text-[10px] md:text-xs tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
