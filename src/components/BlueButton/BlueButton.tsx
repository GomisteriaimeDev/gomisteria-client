import "./BlueButton.scss";

function BlueButton(props: any) {
  return (
    <button
      className="blueButtonComponent"
      type={props.type}
      onClick={props?.onClick}
      disabled={props?.disabled}
    >
      {props.children}
    </button>
  );
}

export default BlueButton;
