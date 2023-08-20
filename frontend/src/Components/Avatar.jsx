import React from "react";

function Avatar(props) {
  return (
    <img className={props.classnaming} src={props.image} alt="avatar_img" />
  );
}

export default Avatar;
