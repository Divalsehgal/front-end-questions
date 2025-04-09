type OptionBoxProps = {
  options: any[];
  onSelect: (selectedOption: any["first_name"]) => void;
};

const OptionsBox = ({ options, onSelect }: OptionBoxProps) => {
  return (
    <div id="mention-options-container">
      <div id="mention-options-box">
        {options.map((option) => (
          <button key={option.id} onClick={() => onSelect(option?.first_name)}>
            {option.first_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionsBox;
