import './styles.css';

const spinnerDots = Array.from({ length: 12 }, (_, index) => <div key={index}></div>);

const Spinner = ({ height, width }) => {
  return (
    <div className="content-spinner" style={{ height, width }}>
      {spinnerDots}
    </div>
  );
};

export default Spinner;
