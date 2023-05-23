export function Button (props) {
  const { handleOnClick, type, text } = props;

  return (
    <>
    <button className="common-button" type={type} onClick={handleOnClick}>{text}</button>
    </>
  )
};