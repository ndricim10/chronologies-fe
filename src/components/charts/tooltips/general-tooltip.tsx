import { CustomToolTipProps } from '@/@types/charts';

const GeneralToolTip = ({ name, color, field }: CustomToolTipProps) => {
  const style = {
    background: color,
    color: 'white',
    padding: 10,
    listStyleType: 'initial',
  };

  return field ? (
    <div className="border-none" style={style}>
      <div className="flex flex-col gap-2 p-2.5 text-xs">
        <p>{name}</p>
        <ul>
          <li className="font-bold">
            <p>{field}</p>
          </li>
        </ul>
      </div>
    </div>
  ) : null;
};

export default GeneralToolTip;
