import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-wrap gap-8 justify-center p-4 bg-white">
      {/* Render each card component for different features */}
      <FeatureCard title="Exportar Arquivos" description="Something short and simple here" />
      <FeatureCard title="Cadastrar Empresas" description="Something short and simple here" />
      <FeatureCard title="Importar arquivos" description="Something short and simple here" />
      <FeatureCard title="Empresas Cadastradas" description="Something short and simple here" />

      {/* Render each info component */}
      <InfoBox time="12:00 PM" date="April, 08" label="Arquivo acessado por ultimo" content="Please add your content here. Keep it short and simple. And smile :)" />
      <InfoBox time="12:00 PM" date="April, 08" label="Empresa acessada por ultimo" content="Please add your content here. Keep it short and simple. And smile :)" />
    </div>
  );
};

// FeatureCard component for each feature box with a grid of squares
const FeatureCard = ({ title, description }) => (
  <div className="w-full max-w-xs md:w-80 lg:w-96 h-auto p-4 rounded-xl shadow-md flex flex-col">
    {/* Grid of squares */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      <Square bg="bg-stone-300" />
      <Square bg="bg-stone-300/50" />
      <Square bg="bg-stone-300" />
      <Square bg="bg-stone-300/50" />
      <Square bg="bg-stone-300" />
      <Square bg="bg-stone-300/50" />
    </div>
    {/* Feature title and description */}
    <div className="p-4">
      <h2 className="text-black text-lg font-medium"> {title} </h2>
      <p className="text-zinc-700 text-sm mt-1">{description}</p>
    </div>
  </div>
);

// Reusable Square component for each box in the grid
const Square = ({ bg }) => <div className={`w-20 h-20 rounded ${bg}`} />;

// InfoBox component for displaying recent activity with time, date, and content
const InfoBox = ({ time, date, label, content }) => (
  <div className="w-full max-w-xl p-6 rounded-3xl shadow-md flex flex-col items-start gap-4 bg-white">
    {/* Date and time */}
    <div className="flex items-center gap-4">
      <div className="text-center">
        <p className="text-black text-sm font-semibold">{time}</p>
        <p className="text-stone-500 text-sm">{date}</p>
      </div>
      <div className="w-px h-10 bg-neutral-200 mx-4" />
      {/* Label and content */}
      <div>
        <h3 className="text-black text-lg font-medium">{label}</h3>
        <p className="text-zinc-700 text-sm mt-1">{content}</p>
      </div>
    </div>
  </div>
);

export default HomePage;
