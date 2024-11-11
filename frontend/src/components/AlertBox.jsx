const AlertBox = ({ message, type }) => {
  let bgColor, borderColor, textColor;

  switch (type) {
    case 'error':
      bgColor = 'bg-red-100';
      borderColor = 'border-red-500';
      textColor = 'text-red-900';
      break;
    case 'warning':
      bgColor = 'bg-yellow-100';
      borderColor = 'border-yellow-500';
      textColor = 'text-yellow-900';
      break;
    case 'info':
      bgColor = 'bg-teal-100';
      borderColor = 'border-teal-500';
      textColor = 'text-teal-900';
      break;
    default:
      bgColor = '';
      borderColor = '';
      textColor = '';
  }

  return (
    <div className={`${bgColor} border-t-4 ${borderColor} rounded-b text-center ${textColor} px-4 py-3 shadow-md`} role="alert">
      <div className="flex justify-between items-center">
        <div className="py-1">
          <svg className={`fill-current h-6 w-6 ${borderColor} mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="...your SVG path..." />
          </svg>
        </div>
        <div>
          <p className="font-bold">{type === 'error' ? 'Erro!' : type === 'warning' ? 'Aviso!' : 'Informação!'}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
