import React from 'react';

const BusinessRegistrationPage = () => {
    return (
        <div className="bg-white flex items-center justify-center min-h-screen px-4 py-8">
            <div className="w-full max-w-4xl p-8 bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-center text-2xl font-bold mb-8">Cadastro de Empresas</h1>
                <form className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div>
                        <LabelInput label="CNPJ" placeholder="CNPJ" required />
                        <LabelInput label="Inscrição Estadual" placeholder="Inscrição Estadual" required />
                        <LabelInput label="Inscrição Municipal" placeholder="Inscrição Municipal" required />
                        <LabelInput label="Razão Social" placeholder="Razão Social" required />
                        <label className="block mb-2 font-medium">Porte da Empresa</label>
                        <select className="w-full border border-gray-300 p-3 rounded-lg">
                            <option>Opções</option>
                            <option>Empresa de Pequeno porte</option>
                            <option>Empresa de Médio porte</option>
                            <option>Empresa de Grande porte</option>
                        </select>
                    </div>

                    {/* Right Column */}
                    <div>
                        <LabelInput label="Endereço" placeholder="Endereço" />
                        <div className="grid grid-cols-2 gap-4">
                            <LabelInput label="Bairro" placeholder="Bairro" />
                            <LabelInput label="Número" placeholder="Número" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <LabelInput label="CEP" placeholder="CEP" />
                            <LabelInput label="Cidade" placeholder="Cidade" />
                        </div>
                        <LabelInput label="Nome Fantasia" placeholder="Nome Fantasia" />
                        <LabelInput label="Serviços/Produtos oferecidos" placeholder="Serviços/Produtos oferecidos" />
                        <LabelInput label="Nicho de Mercado" placeholder="Nicho de Mercado" />
                    </div>
                </form>
                <div className="flex justify-center mt-8">
                    <button className="bg-gray-700 text-white py-2 px-8 rounded-lg hover:bg-gray-600">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

// Component for label and input field with required support
const LabelInput = ({ label, placeholder, required }) => (
    <div className="mb-4">
        <label className="block mb-2 font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type="text"
            placeholder={placeholder}
            className="w-full border border-gray-300 p-3 rounded-lg"
            required={required}
        />
    </div>
);

export default BusinessRegistrationPage;
